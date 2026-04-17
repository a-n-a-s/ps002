interface TickerItem {
  label: string;
  value: number | string;
  color: 'success' | 'warning' | 'blood' | 'info';
}

interface LiveTickerProps {
  items: TickerItem[];
}

export default function LiveTicker({ items }: LiveTickerProps) {
  const prefixByColor: Record<TickerItem['color'], string> = {
    blood: '[!]',
    success: '[OK]',
    warning: '[!]',
    info: '[i]',
  };

  const tickerContent = items
    .map((item) => `${prefixByColor[item.color]} ${item.label}: ${item.value}`)
    .join(' | ');

  const duplicated = `${tickerContent} | ${tickerContent}`;

  return (
    <div className="h-8 bg-[#2a0b14]/85 backdrop-blur-md border-b border-blood/30 overflow-hidden">
      <div className="animate-tick-scroll whitespace-nowrap flex items-center h-full">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-blood px-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blood animate-pulse-dot" />
          LIVE
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-text-sub">
          {duplicated}
        </span>
      </div>
    </div>
  );
}

export { LiveTicker };
