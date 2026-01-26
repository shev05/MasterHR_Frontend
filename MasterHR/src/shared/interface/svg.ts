import type { LucideProps } from 'lucide-react';
import type { ComponentType, FC, SVGProps } from 'react';

export type SVGComponent = FC<SVGProps<SVGSVGElement>> | ComponentType<LucideProps>;
