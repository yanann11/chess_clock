import { FC } from "react";

interface IconProps {
  name: "play" | "pause" | "reset" | "edit" ;
  size?: number;
  className?: string;
}

const Icon: FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const icons: Record<IconProps["name"], JSX.Element> = {
    play: (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    ),
    pause: (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
    ),
    reset: (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8"/></svg>
    ),
    edit: (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 0 2.1 2.1 0 0 1 0 3L7 19l-4 1 1-4Z"/></svg>
    )
  };

  return icons[name] || null;
};

export { Icon };
