// ============================================================================
// VIRTUALIZED LEADERBOARD COMPONENT
// ============================================================================

import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Search,
  ChevronLeft,
  BadgeCheck,
  TrendingUp,
  TrendingDown,
  Crown,
  Award,
  Target,
  Calendar,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardUser } from "../types/trading";
import { formatCurrency } from "../utils/trading-utils";
import { HYBE_COLORS } from "../types/constants";

// ============================================================================
// VIRTUALIZED LIST HOOK - Custom implementation
// ============================================================================

interface UseVirtualizedListOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

function useVirtualizedList({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualizedListOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const items: { index: number; style: React.CSSProperties }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        style: {
          position: "absolute",
          top: i * itemHeight,
          height: itemHeight,
          left: 0,
          right: 0,
        },
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    containerStyle: {
      height: containerHeight,
      overflow: "auto" as const,
    },
    innerStyle: {
      height: totalHeight,
      position: "relative" as const,
    },
  };
}

// ============================================================================
// LEADERBOARD ROW COMPONENT (Memoized)
// ============================================================================

interface LeaderboardRowProps {
  user: LeaderboardUser;
  onSelect: (user: LeaderboardUser) => void;
  style: React.CSSProperties;
}

const LeaderboardRow = React.memo(function LeaderboardRow({ user, onSelect, style }: LeaderboardRowProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-400 font-mono text-sm w-8 text-center">#{rank}</span>;
  };

  return (
    <div
      style={style}
      className="flex items-center gap-3 px-3 hover:bg-zinc-800/50 cursor-pointer transition-colors border-b border-zinc-800/50"
      onClick={() => onSelect(user)}
    >
      <div className="w-10 flex justify-center">
        {getRankBadge(user.rank)}
      </div>

      <div className="relative">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full bg-zinc-700"
          loading="lazy"
        />
        {user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
            <BadgeCheck className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium truncate">{user.name}</p>
          {user.rank <= 100 && (
            <Crown className="w-3 h-3 text-yellow-400" />
          )}
        </div>
        <p className="text-gray-400 text-xs truncate">{user.username}</p>
      </div>

      <div className="text-right">
        <p className="text-white font-medium text-sm">
          {formatCurrency(user.portfolioValue)}
        </p>
        <p className={cn(
          "text-xs flex items-center justify-end gap-1",
          user.totalReturnPercent >= 0 ? "text-green-400" : "text-red-400"
        )}>
          {user.totalReturnPercent >= 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {user.totalReturnPercent >= 0 ? "+" : ""}{user.totalReturnPercent.toFixed(1)}%
        </p>
      </div>
    </div>
  );
});

// ============================================================================
// USER PROFILE MODAL (Memoized)
// ============================================================================

interface UserProfileModalProps {
  user: LeaderboardUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal = React.memo(function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Investor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-3"
              />
              {user.isVerified && (
                <div className="absolute bottom-2 right-0 bg-blue-500 rounded-full p-1">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            <p className="text-gray-400">{user.username}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Rank #{user.rank.toLocaleString()}
              </Badge>
              <Badge className="bg-zinc-700">
                {user.country}
              </Badge>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm italic">"{user.bio}"</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Portfolio Value</p>
              <p className="text-white font-bold">{formatCurrency(user.portfolioValue)}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Return</p>
              <p className={cn(
                "font-bold",
                user.totalReturnPercent >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {user.totalReturnPercent >= 0 ? "+" : ""}{user.totalReturnPercent.toFixed(2)}%
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Trades</p>
              <p className="text-white font-bold">{user.trades.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Win Rate</p>
              <p className="text-white font-bold">{user.winRate}%</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-gray-400">Favorite Artist:</span>
              <span className="text-white">{user.favoriteArtist}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Joined:</span>
              <span className="text-white">{new Date(user.joinedDate).toLocaleDateString()}</span>
            </div>
            {user.withdrawnAmount > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Withdrawn:</span>
                <span className="text-green-400">{formatCurrency(user.withdrawnAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

// ============================================================================
// MAIN VIRTUALIZED LEADERBOARD COMPONENT
// ============================================================================

interface VirtualizedLeaderboardProps {
  users: LeaderboardUser[];
  onBack: () => void;
}

const ITEM_HEIGHT = 72;
const CONTAINER_HEIGHT = 500;

export const VirtualizedLeaderboard = React.memo(function VirtualizedLeaderboard({
  users,
  onBack,
}: VirtualizedLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "top100" | "top1000" | "top10000">("all");
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let result = users;

    // Apply rank filter
    switch (filter) {
      case "top100":
        result = result.filter(u => u.rank <= 100);
        break;
      case "top1000":
        result = result.filter(u => u.rank <= 1000);
        break;
      case "top10000":
        result = result.filter(u => u.rank <= 10000);
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.country.toLowerCase().includes(query)
      );
    }

    return result;
  }, [users, filter, searchQuery]);

  // Virtualization hook
  const {
    visibleItems,
    totalHeight,
    handleScroll,
    containerStyle,
    innerStyle,
  } = useVirtualizedList({
    itemCount: filteredUsers.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  const handleSelectUser = useCallback((user: LeaderboardUser) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setShowProfileModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div
        className="sticky top-0 z-30 p-4"
        style={{ background: `linear-gradient(135deg, ${HYBE_COLORS.gradientStart}, ${HYBE_COLORS.gradientEnd})` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onBack}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Global Leaderboard</h1>
            <p className="text-white/70 text-sm">
              {users.length.toLocaleString()} investors worldwide
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, username, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="top100">Top 100</SelectItem>
              <SelectItem value="top1000">Top 1K</SelectItem>
              <SelectItem value="top10000">Top 10K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Top Performer</p>
            <p className="text-white font-bold text-sm truncate">
              {users[0]?.name || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Avg Return</p>
            <p className="text-green-400 font-bold text-sm">
              +{(users.slice(0, 100).reduce((acc, u) => acc + u.totalReturnPercent, 0) / Math.max(users.slice(0, 100).length, 1)).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Showing</p>
            <p className="text-white font-bold text-sm">
              {filteredUsers.length.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Virtualized List */}
      <div className="px-4">
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardHeader className="border-b border-zinc-800 py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm">Rankings</CardTitle>
              <Badge className="bg-zinc-700 text-gray-300">
                {filteredUsers.length.toLocaleString()} results
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredUsers.length > 0 ? (
              <div style={containerStyle} onScroll={handleScroll}>
                <div style={innerStyle}>
                  {visibleItems.map(({ index, style }) => (
                    <LeaderboardRow
                      key={filteredUsers[index].id}
                      user={filteredUsers[index]}
                      onSelect={handleSelectUser}
                      style={style}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No investors found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={showProfileModal}
        onClose={handleCloseProfile}
      />
    </div>
  );
});

export default VirtualizedLeaderboard;
