import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Languages, Palette } from "lucide-react";

export const TopNavigation = () => {
  return (
    <header className="border-b border-border bg-gradient-card/90 shadow-elegant backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-lg">Universal Pay</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Global Payment Platform</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Select defaultValue="en">
                  <SelectTrigger className="w-auto h-8 sm:h-9 text-xs sm:text-sm border-none bg-transparent">
                    <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Select defaultValue="light">
                  <SelectTrigger className="w-auto h-8 sm:h-9 text-xs sm:text-sm border-none bg-transparent">
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};