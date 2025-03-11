import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface MetricsPanelProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend = 'neutral' 
}) => {
  return (
    <div className="glass-panel panel-shadow rounded-2xl p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="text-sm font-medium ml-2">{title}</h3>
        </div>
        
        {trend === 'up' && (
          <div className="flex items-center text-green-500">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span className="text-xs">Rising</span>
          </div>
        )}
        
        {trend === 'down' && (
          <div className="flex items-center text-red-500">
            <ArrowDown className="h-3 w-3 mr-1" />
            <span className="text-xs">Falling</span>
          </div>
        )}
        
        {trend === 'neutral' && (
          <div className="flex items-center text-muted-foreground">
            <Minus className="h-3 w-3 mr-1" />
            <span className="text-xs">Stable</span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <div className={cn(
          "metrics-value",
          trend === 'up' && "text-green-600",
          trend === 'down' && "text-red-600"
        )}>
          {value}
        </div>
        <div className="metrics-label">{subtitle}</div>
      </div>
    </div>
  );
};

export default MetricsPanel;
