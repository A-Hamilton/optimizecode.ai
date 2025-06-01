import React from "react";
import { LoadingSpinner, Skeleton } from "./index";

// Page Loading Component
interface PageLoadingProps {
  message?: string;
  size?: "sm" | "base" | "lg";
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = "Loading...",
  size = "lg",
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <LoadingSpinner size={size} className="mb-4" />
    <p className="text-gray-400 text-lg">{message}</p>
  </div>
);

// Button Loading State
interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  loading,
  children,
  loadingText,
}) => (
  <>
    {loading && <LoadingSpinner size="sm" />}
    {loading ? loadingText || "Loading..." : children}
  </>
);

// Table Loading Skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} height="20px" />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={`row-${rowIndex}`}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="16px" />
        ))}
      </div>
    ))}
  </div>
);

// Card Loading Skeleton
interface CardSkeletonProps {
  showImage?: boolean;
  showHeader?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = false,
  showHeader = true,
  lines = 3,
}) => (
  <div className="card p-6 space-y-4">
    {showImage && <Skeleton height="200px" className="rounded-lg" />}
    {showHeader && <Skeleton height="24px" width="60%" />}
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
    <div className="flex space-x-2 pt-2">
      <Skeleton height="36px" width="80px" className="rounded-lg" />
      <Skeleton height="36px" width="80px" className="rounded-lg" />
    </div>
  </div>
);

// List Loading Skeleton
interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  showAvatar = false,
}) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div
        key={i}
        className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg"
      >
        {showAvatar && (
          <Skeleton
            width="40px"
            height="40px"
            className="rounded-full flex-shrink-0"
          />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton height="20px" width="80%" />
          <Skeleton height="16px" width="60%" />
          <Skeleton height="14px" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto p-6">
    {/* Header */}
    <div className="flex items-center space-x-6 mb-8">
      <Skeleton width="100px" height="100px" className="rounded-full" />
      <div className="space-y-3">
        <Skeleton height="32px" width="200px" />
        <Skeleton height="20px" width="150px" />
        <Skeleton height="16px" width="300px" />
      </div>
    </div>

    {/* Tabs */}
    <div className="flex space-x-4 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height="40px" width="120px" className="rounded-lg" />
      ))}
    </div>

    {/* Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CardSkeleton lines={4} />
      <CardSkeleton lines={3} />
    </div>
  </div>
);

// Code Editor Skeleton
export const CodeEditorSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <Skeleton height="20px" width="120px" />
        <Skeleton height="32px" width="80px" className="rounded" />
      </div>

      {/* Code lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Skeleton height="16px" width="24px" />
          <Skeleton height="16px" width={`${Math.random() * 40 + 40}%`} />
        </div>
      ))}
    </div>

    <div className="flex justify-center">
      <Skeleton height="48px" width="160px" className="rounded-lg" />
    </div>
  </div>
);

// Pricing Cards Skeleton
export const PricingSkeletonCards: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="card p-6 space-y-4">
        <div className="text-center space-y-2">
          <Skeleton height="24px" width="60%" className="mx-auto" />
          <Skeleton height="48px" width="40%" className="mx-auto" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, j) => (
            <div key={j} className="flex items-center space-x-2">
              <Skeleton width="16px" height="16px" />
              <Skeleton height="16px" width="80%" />
            </div>
          ))}
        </div>

        <Skeleton height="48px" width="100%" className="rounded-lg" />
      </div>
    ))}
  </div>
);

// Dashboard Stats Skeleton
export const DashboardStatsKeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton width="32px" height="32px" className="rounded-lg" />
          <Skeleton width="24px" height="16px" />
        </div>
        <Skeleton height="32px" width="60%" />
        <Skeleton height="16px" width="80%" />
      </div>
    ))}
  </div>
);

// Inline Loading for text content
interface InlineLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  loading,
  children,
  width = "100px",
  height = "16px",
}) => <>{loading ? <Skeleton width={width} height={height} /> : children}</>;

// Full page loading overlay
interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message = "Loading...",
  children,
}) => (
  <div className="relative">
    {children}
    {loading && (
      <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-white text-lg">{message}</p>
        </div>
      </div>
    )}
  </div>
);

export default {
  PageLoading,
  ButtonLoading,
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
  ProfileSkeleton,
  CodeEditorSkeleton,
  PricingSkeletonCards,
  DashboardStatsKeleton,
  InlineLoading,
  LoadingOverlay,
};
