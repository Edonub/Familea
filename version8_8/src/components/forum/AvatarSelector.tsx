
import { Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface AvatarSelectorProps {
  onSelect: (avatarUrl: string) => void;
  selectedAvatar?: string;
}

const avatarOptions = [
  {
    id: "default1",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
  },
  {
    id: "default2",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  },
  {
    id: "default3",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi"
  },
  {
    id: "default4",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe"
  },
  {
    id: "default5",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abby"
  },
  {
    id: "default6",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paco"
  },
  {
    id: "default7",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan"
  },
  {
    id: "default8",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
  },
  {
    id: "default9",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia"
  },
  {
    id: "default10",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramon"
  },
  {
    id: "default11",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia"
  },
  {
    id: "default12",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro"
  },
];

const AvatarSelector = ({ onSelect, selectedAvatar }: AvatarSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 my-4">
      {avatarOptions.map((avatar) => (
        <Button
          key={avatar.id}
          variant="outline"
          className={`p-1 h-auto aspect-square flex items-center justify-center ${
            selectedAvatar === avatar.url 
              ? "border-2 border-familyxp-primary bg-familyxp-light" 
              : "border border-gray-300 hover:border-familyxp-primary hover:bg-familyxp-light"
          }`}
          onClick={() => onSelect(avatar.url)}
        >
          <Avatar className="w-full h-full">
            <AvatarImage
              src={avatar.url}
              alt={`Avatar ${avatar.id}`}
              className="rounded-md"
            />
          </Avatar>
        </Button>
      ))}
      <Button
        variant="outline"
        className="p-1 h-auto aspect-square flex items-center justify-center border border-gray-300 hover:border-familyxp-primary hover:bg-familyxp-light text-gray-500"
      >
        <Grid3X3 size={24} />
        <span className="sr-only">Más opciones</span>
      </Button>
    </div>
  );
};

export default AvatarSelector;
