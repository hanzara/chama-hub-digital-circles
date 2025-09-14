
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import LanguageSelector from './LanguageSelector';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, TrendingUp, Plus, LogOut, Bell, CreditCard, Vote, Smartphone, 
  ArrowLeftRight, Shield, Coins, Brain, Wallet, User, HelpCircle, 
  ChevronDown, Target, BookOpen, MessageSquare, Building2, Settings, GamepadIcon, BarChart3
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItemClass = (path: string) => 
    `flex items-center gap-2 transition-colors ${isActive(path) 
      ? 'text-primary' 
      : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <>
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Header with Global Elements */}
          <div className="flex items-center justify-between h-16">
            {/* Left: Search Bar */}
            <div className="flex items-center">
              <SearchBar />
            </div>

            {/* Center: Brand Logo */}
            <div 
              className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              ChamaVault
            </div>

            {/* Right: Global UI Elements */}
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Notification Bell */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotificationOpen(true)}
                    className="relative h-9 w-9"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                  
                  {/* User Profile */}
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="h-9 w-9"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAuthModalOpen(true)}
                  className="h-9"
                >
                  {t('nav.signIn', 'Sign In')}
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Sections */}
          {user && (
            <div className="space-y-4 pb-4">
              {/* Top Section - 4 Tabs */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={isActive('/') ? "default" : "ghost"}
                    onClick={() => navigate('/')}
                    className="h-9"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>

                  {/* AI Navigator with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/financial-navigator') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <Brain className="h-4 w-4 mr-2" />
                          AI Navigator
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/financial-navigator')}
                              className="justify-start h-8"
                            >
                              <Target className="mr-2 h-4 w-4" />
                              Dashboard
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/cash-flow-predictor')}
                              className="justify-start h-8"
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Cash Flow Predictor
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/financial-health')}
                              className="justify-start h-8"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Health Score
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Smart Lending with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/adaptive-credit') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Smart Lending
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/adaptive-credit')}
                              className="justify-start h-8"
                            >
                              <Brain className="mr-2 h-4 w-4" />
                              Adaptive Credit Lab
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/loans')}
                              className="justify-start h-8"
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Traditional Loans
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/blockchain-lending')}
                              className="justify-start h-8"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              DeFi Loans
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/asset-financing')}
                              className="justify-start h-8"
                            >
                              <Coins className="mr-2 h-4 w-4" />
                              Asset Financing
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Smart Wallet with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/smart-wallet') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <Wallet className="h-4 w-4 mr-2" />
                          Smart Wallet
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/smart-wallet')}
                              className="justify-start h-8"
                            >
                              <Wallet className="mr-2 h-4 w-4" />
                              Smart Wallet
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/mobile-money')}
                              className="justify-start h-8"
                            >
                              <Smartphone className="mr-2 h-4 w-4" />
                              Mobile Money
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/personal-savings')}
                              className="justify-start h-8"
                            >
                              <Coins className="mr-2 h-4 w-4" />
                              Personal Savings
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>

              {/* Middle Section - 4 Tabs */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
                  {/* Chamas with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/chamas') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <Users className="h-4 w-4 mr-2" />
                          Chamas
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/chamas')}
                              className="justify-start h-8"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              My Chamas
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/available-chamas')}
                              className="justify-start h-8"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Available Chamas
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/create-chama')}
                              className="justify-start h-8"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create Chama
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/join-chama')}
                              className="justify-start h-8"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Join Chama
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/advanced-chama')}
                              className="justify-start h-8"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Advanced Features
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Trading with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/p2p-trading') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <ArrowLeftRight className="h-4 w-4 mr-2" />
                          Trading
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/p2p-trading')}
                              className="justify-start h-8"
                            >
                              <ArrowLeftRight className="mr-2 h-4 w-4" />
                              P2P Trading
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/staking')}
                              className="justify-start h-8"
                            >
                              <Coins className="mr-2 h-4 w-4" />
                              Staking
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/investments')}
                              className="justify-start h-8"
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Investments
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/mobile-money')}
                              className="justify-start h-8"
                            >
                              <Smartphone className="mr-2 h-4 w-4" />
                              Mobile Money
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  <Button
                    variant={isActive('/analytics') ? "default" : "ghost"}
                    onClick={() => navigate('/analytics')}
                    className="h-9"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>

                  {/* Community with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/community-hub') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Community
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/community-hub')}
                              className="justify-start h-8"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Community Hub
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/voting-system')}
                              className="justify-start h-8"
                            >
                              <Vote className="mr-2 h-4 w-4" />
                              Voting System
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/financial-navigator')}
                              className="justify-start h-8"
                            >
                              <Target className="mr-2 h-4 w-4" />
                              Financial Navigator
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>

              {/* Bottom Section - 4 Tabs */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={isActive('/admin-portal') ? "default" : "ghost"}
                    onClick={() => navigate('/admin-portal')}
                    className="h-9"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Portal
                  </Button>

                  <Button
                    variant={isActive('/bank-portal') ? "default" : "ghost"}
                    onClick={() => navigate('/bank-portal')}
                    className="h-9"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Bank Portal
                  </Button>

                  {/* Loan Management with Dropdown */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className={`h-9 ${isActive('/apply-loan') ? 'bg-primary text-primary-foreground' : ''}`}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Loan Management
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[300px] gap-2 p-3">
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/apply-loan')}
                              className="justify-start h-8"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Apply for Loan
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/loan-management')}
                              className="justify-start h-8"
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              My Loans
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/adaptive-credit')}
                              className="justify-start h-8"
                            >
                              <Brain className="mr-2 h-4 w-4" />
                              Adaptive Credit
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => navigate('/blockchain-lending')}
                              className="justify-start h-8"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Blockchain Lending
                            </Button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  <Button
                    variant={isActive('/smart-finance') ? "default" : "ghost"}
                    onClick={() => navigate('/smart-finance')}
                    className="h-9"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Smart Finance
                  </Button>
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Quick Links:</span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate('/trivia-game')}
                    className="h-6 px-2"
                  >
                    <GamepadIcon className="h-3 w-3 mr-1" />
                    Trivia Game
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate('/make-contribution')}
                    className="h-6 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Make Contribution
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate('/partner-dashboard')}
                    className="h-6 px-2"
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    Partner Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
      />
      <NotificationCenter 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
    </>
  );
};

export default Navigation;
