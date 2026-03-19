import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';

import { cn } from '@/shared/lib/cn';

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot='collapsible'
      className='flex min-h-36 w-56 flex-col justify-center'
      {...props}
    />
  );
}

function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot='collapsible-trigger'
      className={'group flex items-center gap-2 rounded-sm p-2 text-sm font-medium focus-visible:outline-2'}
      {...props}
    />
  );
}

function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot='collapsible-content'
      {...props}
      className={cn(
        'flex max-h-[var(--collapsible-panel-height)] flex-col justify-end overflow-hidden text-sm transition-all duration-300 ease-out will-change-transform data-[ending-style]:max-h-0 data-[starting-style]:max-h-0',
        props.className
      )}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
