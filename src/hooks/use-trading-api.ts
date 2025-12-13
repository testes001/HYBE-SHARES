import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { UserORM, type UserModel, UserRiskProfile } from '@/components/data/orm/orm_user';
import { StockORM, type StockModel } from '@/components/data/orm/orm_stock';
import { PriceHistoryORM, type PriceHistoryModel } from '@/components/data/orm/orm_price_history';
import { PortfolioORM, type PortfolioModel } from '@/components/data/orm/orm_portfolio';
import { OrderORM, type OrderModel, OrderOrderType, OrderSide, OrderStatus } from '@/components/data/orm/orm_order';
import { WatchlistORM, type WatchlistModel } from '@/components/data/orm/orm_watchlist';
import { TransactionORM, type TransactionModel, TransactionType } from '@/components/data/orm/orm_transaction';
import { NotificationORM, type NotificationModel, NotificationType } from '@/components/data/orm/orm_notification';
import { ExclusiveContentORM, type ExclusiveContentModel, ExclusiveContentContentType } from '@/components/data/orm/orm_exclusive_content';
import { EducationalContentORM, type EducationalContentModel, EducationalContentCategory, EducationalContentContentType, EducationalContentDifficulty } from '@/components/data/orm/orm_educational_content';
import { UserContentProgressORM, type UserContentProgressModel } from '@/components/data/orm/orm_user_content_progress';
import type { Filter, Sort, Page } from '@/components/data/orm/common';
import { SimpleSelector, Direction, DataType } from '@/components/data/orm/common';
import { CreateValue } from '@/components/data/orm/client';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a simple equality filter for a single field
 */
function createEqualFilter(field: string, value: string | number | boolean): Filter {
  const dataType = typeof value === 'string' ? DataType.string : typeof value === 'number' ? DataType.number : DataType.boolean;
  return {
    simples: [
      {
        symbol: SimpleSelector.equal,
        field,
        value: CreateValue(dataType, value, field)
      }
    ],
    multiples: [],
    groups: [],
    unwinds: []
  };
}

/**
 * Create a filter with multiple equality conditions (AND)
 */
function createMultiEqualFilter(conditions: Array<{ field: string; value: string | number | boolean }>): Filter {
  return {
    simples: conditions.map(({ field, value }) => {
      const dataType = typeof value === 'string' ? DataType.string : typeof value === 'number' ? DataType.number : DataType.boolean;
      return {
        symbol: SimpleSelector.equal,
        field,
        value: CreateValue(dataType, value, field)
      };
    }),
    multiples: [],
    groups: [],
    unwinds: []
  };
}

/**
 * Create a sort by single field
 */
function createSort(field: string, descending = false): Sort {
  return {
    orders: [
      {
        symbol: descending ? Direction.descending : Direction.ascending,
        field
      }
    ]
  };
}

// ============================================================================
// USER HOOKS
// ============================================================================

/**
 * Get user by ID
 */
export function useUser(userId: string): UseQueryResult<UserModel, Error> {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<UserModel> => {
      const orm = UserORM.getInstance();
      const users = await orm.getUserById(userId);

      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      return users[0];
    },
    enabled: Boolean(userId),
  });
}

/**
 * Get all users
 */
export function useUsers(): UseQueryResult<UserModel[], Error> {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserModel[]> => {
      const orm = UserORM.getInstance();
      return await orm.getAllUser();
    },
  });
}

/**
 * Create new user
 */
export function useCreateUser(): UseMutationResult<UserModel, Error, Partial<UserModel>> {
  return useMutation({
    mutationFn: async (input: Partial<UserModel>): Promise<UserModel> => {
      if (!input.email || !input.password_hash || !input.name) {
        throw new Error('Email, password, and name are required');
      }

      const orm = UserORM.getInstance();
      const users = await orm.insertUser([input as UserModel]);

      if (!users || users.length === 0) {
        throw new Error('Failed to create user');
      }

      return users[0];
    },
  });
}

/**
 * Update user
 */
export function useUpdateUser(): UseMutationResult<UserModel, Error, UserModel> {
  return useMutation({
    mutationFn: async (input: UserModel): Promise<UserModel> => {
      if (!input.id) {
        throw new Error('User ID is required');
      }

      const orm = UserORM.getInstance();
      const users = await orm.setUserById(input.id, input);

      if (!users || users.length === 0) {
        throw new Error('Failed to update user');
      }

      return users[0];
    },
  });
}

/**
 * Find user by email
 */
export function useUserByEmail(email: string): UseQueryResult<UserModel, Error> {
  return useQuery({
    queryKey: ['user', 'email', email],
    queryFn: async (): Promise<UserModel> => {
      const orm = UserORM.getInstance();
      const users = await orm.getUserByEmail(email);

      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      return users[0];
    },
    enabled: Boolean(email),
  });
}

// ============================================================================
// STOCK HOOKS
// ============================================================================

/**
 * Get stock by ID
 */
export function useStock(stockId: string): UseQueryResult<StockModel, Error> {
  return useQuery({
    queryKey: ['stock', stockId],
    queryFn: async (): Promise<StockModel> => {
      const orm = StockORM.getInstance();
      const stocks = await orm.getStockById(stockId);

      if (!stocks || stocks.length === 0) {
        throw new Error('Stock not found');
      }

      return stocks[0];
    },
    enabled: Boolean(stockId),
  });
}

/**
 * Get all stocks
 */
export function useStocks(): UseQueryResult<StockModel[], Error> {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: async (): Promise<StockModel[]> => {
      const orm = StockORM.getInstance();
      return await orm.getAllStock();
    },
  });
}

/**
 * Find stock by symbol
 */
export function useStockBySymbol(symbol: string): UseQueryResult<StockModel, Error> {
  return useQuery({
    queryKey: ['stock', 'symbol', symbol],
    queryFn: async (): Promise<StockModel> => {
      const orm = StockORM.getInstance();
      const stocks = await orm.getStockBySymbol(symbol);

      if (!stocks || stocks.length === 0) {
        throw new Error('Stock not found');
      }

      return stocks[0];
    },
    enabled: Boolean(symbol),
  });
}

/**
 * Get featured stocks
 */
export function useFeaturedStocks(): UseQueryResult<StockModel[], Error> {
  return useQuery({
    queryKey: ['stocks', 'featured'],
    queryFn: async (): Promise<StockModel[]> => {
      const orm = StockORM.getInstance();
      return await orm.getStockByIsFeatured(true);
    },
  });
}

/**
 * Update stock price/data
 */
export function useUpdateStock(): UseMutationResult<StockModel, Error, StockModel> {
  return useMutation({
    mutationFn: async (input: StockModel): Promise<StockModel> => {
      if (!input.id) {
        throw new Error('Stock ID is required');
      }

      const orm = StockORM.getInstance();
      const stocks = await orm.setStockById(input.id, input);

      if (!stocks || stocks.length === 0) {
        throw new Error('Failed to update stock');
      }

      return stocks[0];
    },
  });
}

// ============================================================================
// PRICE HISTORY HOOKS
// ============================================================================

/**
 * Get price history for a stock
 */
export function usePriceHistory(stockId: string): UseQueryResult<PriceHistoryModel[], Error> {
  return useQuery({
    queryKey: ['price-history', stockId],
    queryFn: async (): Promise<PriceHistoryModel[]> => {
      const orm = PriceHistoryORM.getInstance();
      const filter = createEqualFilter('stock_id', stockId);
      const [history] = await orm.listPriceHistory(filter);
      return history;
    },
    enabled: Boolean(stockId),
  });
}

/**
 * Add price history entry
 */
export function useCreatePriceHistory(): UseMutationResult<PriceHistoryModel, Error, Partial<PriceHistoryModel>> {
  return useMutation({
    mutationFn: async (input: Partial<PriceHistoryModel>): Promise<PriceHistoryModel> => {
      if (!input.stock_id || input.price === undefined) {
        throw new Error('Stock ID and price are required');
      }

      const orm = PriceHistoryORM.getInstance();
      const entries = await orm.insertPriceHistory([input as PriceHistoryModel]);

      if (!entries || entries.length === 0) {
        throw new Error('Failed to create price history entry');
      }

      return entries[0];
    },
  });
}

// ============================================================================
// PORTFOLIO HOOKS
// ============================================================================

/**
 * Get user's portfolio
 */
export function usePortfolio(userId: string): UseQueryResult<PortfolioModel[], Error> {
  return useQuery({
    queryKey: ['portfolio', userId],
    queryFn: async (): Promise<PortfolioModel[]> => {
      const orm = PortfolioORM.getInstance();
      const filter = createEqualFilter('user_id', userId);
      const [portfolio] = await orm.listPortfolio(filter);
      return portfolio;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Get specific portfolio holding
 */
export function usePortfolioItem(stockId: string, userId: string): UseQueryResult<PortfolioModel, Error> {
  return useQuery({
    queryKey: ['portfolio', userId, stockId],
    queryFn: async (): Promise<PortfolioModel> => {
      const orm = PortfolioORM.getInstance();
      const items = await orm.getPortfolioByStockIdUserId(stockId, userId);

      if (!items || items.length === 0) {
        throw new Error('Portfolio item not found');
      }

      return items[0];
    },
    enabled: Boolean(stockId) && Boolean(userId),
  });
}

/**
 * Create portfolio entry
 */
export function useCreatePortfolio(): UseMutationResult<PortfolioModel, Error, Partial<PortfolioModel>> {
  return useMutation({
    mutationFn: async (input: Partial<PortfolioModel>): Promise<PortfolioModel> => {
      if (!input.user_id || !input.stock_id || input.shares === undefined) {
        throw new Error('User ID, stock ID, and shares are required');
      }

      const orm = PortfolioORM.getInstance();
      const entries = await orm.insertPortfolio([input as PortfolioModel]);

      if (!entries || entries.length === 0) {
        throw new Error('Failed to create portfolio entry');
      }

      return entries[0];
    },
  });
}

/**
 * Update portfolio shares/cost
 */
export function useUpdatePortfolio(): UseMutationResult<PortfolioModel, Error, PortfolioModel> {
  return useMutation({
    mutationFn: async (input: PortfolioModel): Promise<PortfolioModel> => {
      if (!input.id) {
        throw new Error('Portfolio ID is required');
      }

      const orm = PortfolioORM.getInstance();
      const entries = await orm.setPortfolioById(input.id, input);

      if (!entries || entries.length === 0) {
        throw new Error('Failed to update portfolio');
      }

      return entries[0];
    },
  });
}

// ============================================================================
// ORDER HOOKS
// ============================================================================

/**
 * Get user's orders
 */
export function useOrders(userId: string): UseQueryResult<OrderModel[], Error> {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async (): Promise<OrderModel[]> => {
      const orm = OrderORM.getInstance();
      const filter = createEqualFilter('user_id', userId);
      const [orders] = await orm.listOrder(filter);
      return orders;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Get pending orders for user
 */
export function usePendingOrders(userId: string): UseQueryResult<OrderModel[], Error> {
  return useQuery({
    queryKey: ['orders', userId, 'pending'],
    queryFn: async (): Promise<OrderModel[]> => {
      const orm = OrderORM.getInstance();
      return await orm.getOrderByStatusUserId(OrderStatus.Pending, userId);
    },
    enabled: Boolean(userId),
  });
}

/**
 * Place new order
 */
export function useCreateOrder(): UseMutationResult<OrderModel, Error, Partial<OrderModel>> {
  return useMutation({
    mutationFn: async (input: Partial<OrderModel>): Promise<OrderModel> => {
      if (!input.user_id || !input.stock_id || input.quantity === undefined || input.order_type === undefined || input.side === undefined) {
        throw new Error('User ID, stock ID, quantity, order type, and side are required');
      }

      const orm = OrderORM.getInstance();
      const orders = await orm.insertOrder([{ ...input, status: OrderStatus.Pending } as OrderModel]);

      if (!orders || orders.length === 0) {
        throw new Error('Failed to create order');
      }

      return orders[0];
    },
  });
}

/**
 * Update order status
 */
export function useUpdateOrder(): UseMutationResult<OrderModel, Error, OrderModel> {
  return useMutation({
    mutationFn: async (input: OrderModel): Promise<OrderModel> => {
      if (!input.id) {
        throw new Error('Order ID is required');
      }

      const orm = OrderORM.getInstance();
      const orders = await orm.setOrderById(input.id, input);

      if (!orders || orders.length === 0) {
        throw new Error('Failed to update order');
      }

      return orders[0];
    },
  });
}

/**
 * Cancel order
 */
export function useCancelOrder(): UseMutationResult<OrderModel, Error, OrderModel> {
  return useMutation({
    mutationFn: async (input: OrderModel): Promise<OrderModel> => {
      if (!input.id) {
        throw new Error('Order ID is required');
      }

      const orm = OrderORM.getInstance();
      const updatedOrder = { ...input, status: OrderStatus.Cancelled };
      const orders = await orm.setOrderById(input.id, updatedOrder);

      if (!orders || orders.length === 0) {
        throw new Error('Failed to cancel order');
      }

      return orders[0];
    },
  });
}

// ============================================================================
// WATCHLIST HOOKS
// ============================================================================

/**
 * Get user's watchlist
 */
export function useWatchlist(userId: string): UseQueryResult<WatchlistModel[], Error> {
  return useQuery({
    queryKey: ['watchlist', userId],
    queryFn: async (): Promise<WatchlistModel[]> => {
      const orm = WatchlistORM.getInstance();
      const filter = createEqualFilter('user_id', userId);
      const sort = createSort('position', false);
      const [watchlist] = await orm.listWatchlist(filter, sort);
      return watchlist;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Add stock to watchlist
 */
export function useAddToWatchlist(): UseMutationResult<WatchlistModel, Error, Partial<WatchlistModel>> {
  return useMutation({
    mutationFn: async (input: Partial<WatchlistModel>): Promise<WatchlistModel> => {
      if (!input.user_id || !input.stock_id || input.position === undefined) {
        throw new Error('User ID, stock ID, and position are required');
      }

      const orm = WatchlistORM.getInstance();
      const entries = await orm.insertWatchlist([input as WatchlistModel]);

      if (!entries || entries.length === 0) {
        throw new Error('Failed to add to watchlist');
      }

      return entries[0];
    },
  });
}

/**
 * Remove from watchlist
 */
export function useRemoveFromWatchlist(): UseMutationResult<void, Error, { stockId: string; userId: string }> {
  return useMutation({
    mutationFn: async (input: { stockId: string; userId: string }): Promise<void> => {
      if (!input.stockId || !input.userId) {
        throw new Error('Stock ID and user ID are required');
      }

      const orm = WatchlistORM.getInstance();
      await orm.deleteWatchlistByStockIdUserId(input.stockId, input.userId);
    },
  });
}

/**
 * Update watchlist order
 */
export function useReorderWatchlist(): UseMutationResult<WatchlistModel, Error, WatchlistModel> {
  return useMutation({
    mutationFn: async (input: WatchlistModel): Promise<WatchlistModel> => {
      if (!input.id) {
        throw new Error('Watchlist ID is required');
      }

      const orm = WatchlistORM.getInstance();
      const entries = await orm.setWatchlistById(input.id, input);

      if (!entries || entries.length === 0) {
        throw new Error('Failed to reorder watchlist');
      }

      return entries[0];
    },
  });
}

// ============================================================================
// TRANSACTION HOOKS
// ============================================================================

/**
 * Get user's transactions
 */
export function useTransactions(userId: string): UseQueryResult<TransactionModel[], Error> {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async (): Promise<TransactionModel[]> => {
      const orm = TransactionORM.getInstance();
      const filter = createEqualFilter('user_id', userId);
      const sort = createSort('create_time', true);
      const [transactions] = await orm.listTransaction(filter, sort);
      return transactions;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Record transaction
 */
export function useCreateTransaction(): UseMutationResult<TransactionModel, Error, Partial<TransactionModel>> {
  return useMutation({
    mutationFn: async (input: Partial<TransactionModel>): Promise<TransactionModel> => {
      if (!input.user_id || input.type === undefined || input.amount === undefined || input.balance_after === undefined) {
        throw new Error('User ID, type, amount, and balance_after are required');
      }

      const orm = TransactionORM.getInstance();
      const transactions = await orm.insertTransaction([input as TransactionModel]);

      if (!transactions || transactions.length === 0) {
        throw new Error('Failed to create transaction');
      }

      return transactions[0];
    },
  });
}

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

/**
 * Get user's notifications
 */
export function useNotifications(userId: string): UseQueryResult<NotificationModel[], Error> {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<NotificationModel[]> => {
      const orm = NotificationORM.getInstance();
      const filter = createEqualFilter('user_id', userId);
      const sort = createSort('create_time', true);
      const [notifications] = await orm.listNotification(filter, sort);
      return notifications;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Get unread notification count
 */
export function useUnreadNotifications(userId: string): UseQueryResult<number, Error> {
  return useQuery({
    queryKey: ['notifications', userId, 'unread'],
    queryFn: async (): Promise<number> => {
      const orm = NotificationORM.getInstance();
      const filter = createMultiEqualFilter([
        { field: 'user_id', value: userId },
        { field: 'is_read', value: false }
      ]);
      const [notifications] = await orm.listNotification(filter);
      return notifications.length;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Create notification
 */
export function useCreateNotification(): UseMutationResult<NotificationModel, Error, Partial<NotificationModel>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<NotificationModel>): Promise<NotificationModel> => {
      if (!input.user_id || input.type === undefined || !input.title || !input.message) {
        throw new Error('User ID, type, title, and message are required');
      }

      const orm = NotificationORM.getInstance();
      const notifications = await orm.insertNotification([{ ...input, is_read: false } as NotificationModel]);

      if (!notifications || notifications.length === 0) {
        throw new Error('Failed to create notification');
      }

      return notifications[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * Mark notification as read
 */
export function useMarkNotificationRead(): UseMutationResult<NotificationModel, Error, NotificationModel> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NotificationModel): Promise<NotificationModel> => {
      if (!input.id) {
        throw new Error('Notification ID is required');
      }

      const orm = NotificationORM.getInstance();
      const updatedNotification = { ...input, is_read: true };
      const notifications = await orm.setNotificationById(input.id, updatedNotification);

      if (!notifications || notifications.length === 0) {
        throw new Error('Failed to mark notification as read');
      }

      return notifications[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============================================================================
// EXCLUSIVE CONTENT HOOKS
// ============================================================================

/**
 * Get available exclusive content for user (based on their portfolio)
 */
export function useExclusiveContent(userId: string): UseQueryResult<ExclusiveContentModel[], Error> {
  return useQuery({
    queryKey: ['exclusive-content', userId],
    queryFn: async (): Promise<ExclusiveContentModel[]> => {
      const contentOrm = ExclusiveContentORM.getInstance();
      const portfolioOrm = PortfolioORM.getInstance();

      // Get user's portfolio to calculate total shares
      const filter = createEqualFilter('user_id', userId);
      const [portfolio] = await portfolioOrm.listPortfolio(filter);
      const totalShares = portfolio.reduce((sum, item) => sum + item.shares, 0);

      // Get all content and filter by shares requirement
      const allContent = await contentOrm.getAllExclusiveContent();
      return allContent.filter(content => content.min_shares_required <= totalShares);
    },
    enabled: Boolean(userId),
  });
}

/**
 * Get all exclusive content
 */
export function useAllExclusiveContent(): UseQueryResult<ExclusiveContentModel[], Error> {
  return useQuery({
    queryKey: ['exclusive-content'],
    queryFn: async (): Promise<ExclusiveContentModel[]> => {
      const orm = ExclusiveContentORM.getInstance();
      return await orm.getAllExclusiveContent();
    },
  });
}

// ============================================================================
// EDUCATIONAL CONTENT HOOKS
// ============================================================================

/**
 * List educational content with filters
 */
export function useEducationalContent(
  category?: EducationalContentCategory,
  difficulty?: EducationalContentDifficulty
): UseQueryResult<EducationalContentModel[], Error> {
  return useQuery({
    queryKey: ['educational-content', category, difficulty],
    queryFn: async (): Promise<EducationalContentModel[]> => {
      const orm = EducationalContentORM.getInstance();

      if (category !== undefined && difficulty !== undefined) {
        return await orm.getEducationalContentByCategoryDifficulty(category, difficulty);
      }

      if (category !== undefined || difficulty !== undefined) {
        const conditions: Array<{ field: string; value: string | number | boolean }> = [];

        if (category !== undefined) {
          conditions.push({ field: 'category', value: category });
        }

        if (difficulty !== undefined) {
          conditions.push({ field: 'difficulty', value: difficulty });
        }

        const filter = createMultiEqualFilter(conditions);
        const [content] = await orm.listEducationalContent(filter);
        return content;
      }

      return await orm.getAllEducationalContent();
    },
  });
}

/**
 * Get single educational content by ID
 */
export function useEducationalContentById(contentId: string): UseQueryResult<EducationalContentModel, Error> {
  return useQuery({
    queryKey: ['educational-content', contentId],
    queryFn: async (): Promise<EducationalContentModel> => {
      const orm = EducationalContentORM.getInstance();
      const content = await orm.getEducationalContentById(contentId);

      if (!content || content.length === 0) {
        throw new Error('Educational content not found');
      }

      return content[0];
    },
    enabled: Boolean(contentId),
  });
}

/**
 * Get user's content progress
 */
export function useUserContentProgress(userId: string): UseQueryResult<UserContentProgressModel[], Error> {
  return useQuery({
    queryKey: ['user-content-progress', userId],
    queryFn: async (): Promise<UserContentProgressModel[]> => {
      const orm = UserContentProgressORM.getInstance();
      const filter = createEqualFilter('user_id', userId);
      const [progress] = await orm.listUserContentProgress(filter);
      return progress;
    },
    enabled: Boolean(userId),
  });
}

/**
 * Mark content as complete
 */
export function useUpdateContentProgress(): UseMutationResult<UserContentProgressModel, Error, { userId: string; contentId: string; completed: boolean }> {
  return useMutation({
    mutationFn: async (input: { userId: string; contentId: string; completed: boolean }): Promise<UserContentProgressModel> => {
      if (!input.userId || !input.contentId) {
        throw new Error('User ID and content ID are required');
      }

      const orm = UserContentProgressORM.getInstance();

      // Check if progress record exists
      const existing = await orm.getUserContentProgressByContentIdUserId(input.contentId, input.userId);

      if (existing && existing.length > 0) {
        // Update existing record
        const updated: UserContentProgressModel = {
          ...existing[0],
          completed: input.completed,
          completed_at: input.completed ? new Date().toISOString() : null
        };
        const result = await orm.setUserContentProgressById(updated.id, updated);

        if (!result || result.length === 0) {
          throw new Error('Failed to update content progress');
        }

        return result[0];
      } else {
        // Create new record
        const newProgress: Partial<UserContentProgressModel> = {
          user_id: input.userId,
          content_id: input.contentId,
          completed: input.completed,
          completed_at: input.completed ? new Date().toISOString() : null
        };
        const result = await orm.insertUserContentProgress([newProgress as UserContentProgressModel]);

        if (!result || result.length === 0) {
          throw new Error('Failed to create content progress');
        }

        return result[0];
      }
    },
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export types and enums for convenience
export type {
  UserModel,
  StockModel,
  PriceHistoryModel,
  PortfolioModel,
  OrderModel,
  WatchlistModel,
  TransactionModel,
  NotificationModel,
  ExclusiveContentModel,
  EducationalContentModel,
  UserContentProgressModel,
};

export {
  UserRiskProfile,
  OrderOrderType,
  OrderSide,
  OrderStatus,
  TransactionType,
  NotificationType,
  ExclusiveContentContentType,
  EducationalContentCategory,
  EducationalContentContentType,
  EducationalContentDifficulty,
};
