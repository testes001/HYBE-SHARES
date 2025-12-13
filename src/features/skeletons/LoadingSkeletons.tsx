// ============================================================================
// LOADING SKELETON COMPONENTS
// ============================================================================

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// PORTFOLIO SKELETON
// ============================================================================

export const PortfolioSkeleton = React.memo(function PortfolioSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Balance card skeleton */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-48 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Portfolio items skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// STOCK CARD SKELETON
// ============================================================================

export const StockCardSkeleton = React.memo(function StockCardSkeleton() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ============================================================================
// LEADERBOARD ROW SKELETON
// ============================================================================

export const LeaderboardRowSkeleton = React.memo(function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-zinc-800/50">
      <Skeleton className="h-6 w-10" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
});

// ============================================================================
// TRADE VIEW SKELETON
// ============================================================================

export const TradeSkeleton = React.memo(function TradeSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Search skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Quick actions skeleton */}
      <div className="flex gap-2 overflow-x-auto py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
        ))}
      </div>

      {/* Stock list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StockCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// CHART SKELETON
// ============================================================================

export const ChartSkeleton = React.memo(function ChartSkeleton() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-10" />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
});

// ============================================================================
// TRANSACTION HISTORY SKELETON
// ============================================================================

export const TransactionSkeleton = React.memo(function TransactionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

// ============================================================================
// NOTIFICATION SKELETON
// ============================================================================

export const NotificationSkeleton = React.memo(function NotificationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 border-b border-zinc-800">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================================
// ACCOUNT SKELETON
// ============================================================================

export const AccountSkeleton = React.memo(function AccountSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* Profile header skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3 text-center">
              <Skeleton className="h-4 w-16 mx-auto mb-2" />
              <Skeleton className="h-6 w-20 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu items skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// FULL PAGE LOADING
// ============================================================================

export const FullPageLoader = React.memo(function FullPageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">H</span>
        </div>
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
});

export default {
  PortfolioSkeleton,
  StockCardSkeleton,
  LeaderboardRowSkeleton,
  TradeSkeleton,
  ChartSkeleton,
  TransactionSkeleton,
  NotificationSkeleton,
  AccountSkeleton,
  FullPageLoader,
};
