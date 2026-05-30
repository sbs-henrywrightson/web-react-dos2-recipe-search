import { AppButton } from '@components';

type Props = {
  value: string;
  highlight: boolean;
  className?: string;
  onPillClick: (value: string) => void;
};

export default function Pill({ value, highlight, className, onPillClick }: Props) {
  const handleClick = () => {
    onPillClick(value);
  };

  return (
    <AppButton
      buttonType={highlight ? 'filled' : 'plain'}
      className={['inline-block px-1 pb-0.5 text-xs tracking-tight rounded-md truncate', className].join(' ')}
      onClick={() => handleClick()}
    >
      {value}
    </AppButton>
  );
}
