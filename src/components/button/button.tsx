type ButtonProps = {
  buttonType?: 'outline' | 'filled' | 'plain';
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function AppButton({ buttonType, className, children, onClick }: ButtonProps) {
  return (
    <button className={[!buttonType ? 'filled-button' : `${buttonType}-button`, className].join(' ')} onClick={onClick}>
      {children}
    </button>
  );
}
