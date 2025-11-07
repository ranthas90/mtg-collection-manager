import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar.tsx";

interface MtgExpansionIconProps {
  image: string;
  name: string;
}

export function MtgExpansionIcon({ image, name }: MtgExpansionIconProps) {
  return (
    <Avatar>
      <AvatarImage src={image} alt={`${name} set icon`} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
