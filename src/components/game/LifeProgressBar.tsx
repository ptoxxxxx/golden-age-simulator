interface LifeProgressBarProps {
  age: number;
}

const LifeProgressBar = ({ age }: LifeProgressBarProps) => {
  const MIN_AGE = 20;
  const MAX_AGE = 100;
  const progress = ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100;

  return (
    <div className="space-y-2">
      <div className="relative pt-4">
        {/* Progress bar background */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Age indicator ball */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all"
          style={{ left: `${progress}%` }}
        >
          <div className="w-12 h-12 rounded-full bg-primary border-4 border-background shadow-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">{age}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{MIN_AGE}</span>
        <span>{MAX_AGE}</span>
      </div>
    </div>
  );
};

export default LifeProgressBar;
