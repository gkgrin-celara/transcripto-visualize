
import React from 'react';
import { cn } from '@/lib/utils';

interface MetricsPanelProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className
}) => {
  return (
    <div className={cn(
      "glass-panel panel-shadow rounded-2xl p-5 animate-scale-in",
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 rounded-full bg-primary/5">{icon}</div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-baseline">
          <span className="metrics-value">{value}</span>
          
          {trend && (
            <span className={cn(
              "ml-2 text-xs flex items-center",
              trend === 'up' && "text-green-500",
              trend === 'down' && "text-red-500",
              trend === 'neutral' && "text-muted-foreground"
            )}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trend === 'neutral' && '→ '}
              
              {subtitle}
            </span>
          )}
        </div>
        
        {!trend && subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricsPanel;
