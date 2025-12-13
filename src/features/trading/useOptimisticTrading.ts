// ============================================================================
// OPTIMISTIC TRADING HOOK
// ============================================================================

import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { PortfolioModel } from "@/components/data/orm/orm_portfolio";
import type { OrderModel } from "@/components/data/orm/orm_order";
import type { UserModel } from "@/components/data/orm/orm_user";
import type { StockModel } from "@/components/data/orm/orm_stock";

// ============================================================================
// TYPES
// ============================================================================

interface OptimisticOrder {
  id: string;
  userId: string;
  stockId: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  status: "pending" | "executing" | "completed" | "failed";
  timestamp: number;
}

interface UseOptimisticTradingOptions {
  userId: string;
  onOrderComplete?: (order: OptimisticOrder) => void;
  onOrderFailed?: (order: OptimisticOrder, error: Error) => void;
}

interface TradeParams {
  stockId: string;
  stockSymbol: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  currentBalance: number;
  currentShares: number;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useOptimisticTrading({
  userId,
  onOrderComplete,
  onOrderFailed,
}: UseOptimisticTradingOptions) {
  const queryClient = useQueryClient();
  const [pendingOrders, setPendingOrders] = useState<OptimisticOrder[]>([]);

  // Create optimistic order ID
  const createOptimisticId = useCallback(() => {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Execute buy order with optimistic update
  const executeBuy = useCallback(
    async (params: TradeParams) => {
      const { stockId, stockSymbol, quantity, price, currentBalance } = params;
      const totalCost = quantity * price;

      // Validate
      if (totalCost > currentBalance) {
        throw new Error("Insufficient balance");
      }

      const optimisticOrder: OptimisticOrder = {
        id: createOptimisticId(),
        userId,
        stockId,
        side: "buy",
        quantity,
        price,
        status: "pending",
        timestamp: Date.now(),
      };

      // Add to pending orders
      setPendingOrders((prev) => [...prev, optimisticOrder]);

      // Optimistically update the cache
      queryClient.setQueryData<UserModel>(["user", userId], (old) => {
        if (!old) return old;
        return {
          ...old,
          virtual_balance: old.virtual_balance - totalCost,
        };
      });

      queryClient.setQueryData<PortfolioModel[]>(["portfolio", userId], (old) => {
        if (!old) return old;
        const existingIndex = old.findIndex((p) => p.stock_id === stockId);

        if (existingIndex >= 0) {
          const existing = old[existingIndex];
          const newShares = existing.shares + quantity;
          const newAvgCost =
            (existing.average_cost * existing.shares + totalCost) / newShares;

          return [
            ...old.slice(0, existingIndex),
            { ...existing, shares: newShares, average_cost: newAvgCost },
            ...old.slice(existingIndex + 1),
          ];
        }

        // Add new position
        return [
          ...old,
          {
            id: optimisticOrder.id,
            user_id: userId,
            stock_id: stockId,
            shares: quantity,
            average_cost: price,
            data_creator: userId,
            data_updater: userId,
            create_time: String(Date.now()),
            update_time: String(Date.now()),
          },
        ];
      });

      // Update order status
      setPendingOrders((prev) =>
        prev.map((o) =>
          o.id === optimisticOrder.id ? { ...o, status: "executing" as const } : o
        )
      );

      return optimisticOrder;
    },
    [userId, queryClient, createOptimisticId]
  );

  // Execute sell order with optimistic update
  const executeSell = useCallback(
    async (params: TradeParams) => {
      const { stockId, quantity, price, currentShares } = params;
      const totalProceeds = quantity * price;

      // Validate
      if (quantity > currentShares) {
        throw new Error("Insufficient shares");
      }

      const optimisticOrder: OptimisticOrder = {
        id: createOptimisticId(),
        userId,
        stockId,
        side: "sell",
        quantity,
        price,
        status: "pending",
        timestamp: Date.now(),
      };

      // Add to pending orders
      setPendingOrders((prev) => [...prev, optimisticOrder]);

      // Optimistically update the cache
      queryClient.setQueryData<UserModel>(["user", userId], (old) => {
        if (!old) return old;
        return {
          ...old,
          virtual_balance: old.virtual_balance + totalProceeds,
        };
      });

      queryClient.setQueryData<PortfolioModel[]>(["portfolio", userId], (old) => {
        if (!old) return old;
        const existingIndex = old.findIndex((p) => p.stock_id === stockId);

        if (existingIndex >= 0) {
          const existing = old[existingIndex];
          const remainingShares = existing.shares - quantity;

          if (remainingShares <= 0) {
            // Remove position
            return [...old.slice(0, existingIndex), ...old.slice(existingIndex + 1)];
          }

          return [
            ...old.slice(0, existingIndex),
            { ...existing, shares: remainingShares },
            ...old.slice(existingIndex + 1),
          ];
        }

        return old;
      });

      // Update order status
      setPendingOrders((prev) =>
        prev.map((o) =>
          o.id === optimisticOrder.id ? { ...o, status: "executing" as const } : o
        )
      );

      return optimisticOrder;
    },
    [userId, queryClient, createOptimisticId]
  );

  // Complete order (called after server confirms)
  const completeOrder = useCallback(
    (orderId: string) => {
      setPendingOrders((prev) => {
        const order = prev.find((o) => o.id === orderId);
        if (order) {
          const completedOrder = { ...order, status: "completed" as const };
          onOrderComplete?.(completedOrder);
          // Remove from pending after a delay
          setTimeout(() => {
            setPendingOrders((p) => p.filter((o) => o.id !== orderId));
          }, 2000);
        }
        return prev.map((o) =>
          o.id === orderId ? { ...o, status: "completed" as const } : o
        );
      });

      // Invalidate queries to get fresh data
      queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    },
    [queryClient, userId, onOrderComplete]
  );

  // Fail order and rollback
  const failOrder = useCallback(
    (orderId: string, error: Error) => {
      setPendingOrders((prev) => {
        const order = prev.find((o) => o.id === orderId);
        if (order) {
          const failedOrder = { ...order, status: "failed" as const };
          onOrderFailed?.(failedOrder, error);
        }
        return prev.map((o) =>
          o.id === orderId ? { ...o, status: "failed" as const } : o
        );
      });

      // Rollback by invalidating cache (will refetch fresh data)
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });

      // Remove failed order after showing error
      setTimeout(() => {
        setPendingOrders((p) => p.filter((o) => o.id !== orderId));
      }, 5000);
    },
    [queryClient, userId, onOrderFailed]
  );

  // Check if there are any pending orders for a stock
  const hasPendingOrder = useCallback(
    (stockId: string) => {
      return pendingOrders.some(
        (o) => o.stockId === stockId && (o.status === "pending" || o.status === "executing")
      );
    },
    [pendingOrders]
  );

  return {
    pendingOrders,
    executeBuy,
    executeSell,
    completeOrder,
    failOrder,
    hasPendingOrder,
  };
}

export default useOptimisticTrading;
