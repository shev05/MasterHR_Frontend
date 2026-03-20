declare module 'react-input-mask' {
  import { ComponentType, InputHTMLAttributes } from 'react';

  interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskPlaceholder?: string;
    alwaysShowMask?: boolean;
    maskChar?: string;
    formatChars?: Record<string, string>;
    beforeMaskedValueChange?: (
      newState: { value: string; selection: { start: number; end: number } },
      oldState: { value: string; selection: { start: number; end: number } },
      userInput: string,
      mask: string
    ) => { value: string; selection: { start: number; end: number } };
    children?: (inputProps: InputHTMLAttributes<HTMLInputElement>) => React.ReactNode;
  }

  const InputMask: ComponentType<InputMaskProps>;
  export default InputMask;
}
