import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Target, BookOpen, MessageSquare, Building2, Settings, GamepadIcon, BarChart3,
  Handshake, Lock, ChevronUp, ChevronDown, Calendar, DollarSign, ShieldCheck,
  MessageCircle, PieChart, UserCheck
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
  const [activeTab, setActiveTab] = useState('HOME');

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

  // Card component for grid items
  const GridCard = ({ icon: Icon, title, subtitle, onClick, variant = "default", size = "default" }: {
    icon: any;
    title: string;
    subtitle?: string;
    onClick: () => void;
    variant?: "default" | "primary" | "secondary" | "success";
    size?: "default" | "large" | "small";
  }) => {
    const sizeClasses = {
      large: "p-6 h-24 w-full",
      default: "p-4 h-20 w-full",
      small: "p-3 h-16 w-full"
    };

    const variantClasses = {
      default: "bg-card hover:bg-accent",
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-green-500 hover:bg-green-600 text-white", 
      success: "bg-orange-500 hover:bg-orange-600 text-white"
    };

    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-1 border shadow-sm`}
      >
        <Icon className={`${size === 'small' ? 'h-4 w-4' : size === 'large' ? 'h-6 w-6' : 'h-5 w-5'}`} />
        <span className={`font-medium ${size === 'small' ? 'text-xs' : 'text-sm'}`}>{title}</span>
        {subtitle && <span className="text-xs opacity-75">{subtitle}</span>}
      </Button>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <div className="space-y-6">
            {/* Large Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GridCard
                icon={Building2}
                title="Bank Portal"
                onClick={() => navigate('/bank-portal')}
                variant="primary"
                size="large"
              />
              <GridCard
                icon={Handshake}
                title="Partner Dashboard"
                onClick={() => navigate('/partner-dashboard')}
                variant="secondary"
                size="large"
              />
              <GridCard
                icon={Lock}
                title="Admin Portal"
                onClick={() => navigate('/admin-portal')}
                variant="success"
                size="large"
              />
            </div>

            {/* Medium Icons Row */}
            <div className="grid grid-cols-3 gap-4">
              <GridCard
                icon={TrendingUp}
                title="Investment"
                onClick={() => navigate('/investments')}
              />
              <GridCard
                icon={ShieldCheck}
                title="Smart Finance"
                onClick={() => navigate('/smart-finance')}
              />
              <GridCard
                icon={Users}
                title="Community"
                onClick={() => navigate('/community-hub')}
              />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-4">
              <GridCard
                icon={HelpCircle}
                title="Trivia Game"
                onClick={() => navigate('/trivia-game')}
              />
              <GridCard
                icon={BarChart3}
                title="Analytics"
                onClick={() => navigate('/analytics')}
              />
            </div>
          </div>
        );

      case 'CHAMA':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Quick Action</h2>
            <div className="grid grid-cols-2 gap-4">
              <GridCard
                icon={Wallet}
                title="MYCHAMA"
                onClick={() => navigate('/chamas')}
                size="large"
              />
              <GridCard
                icon={Plus}
                title="CREATE CHAMA"
                onClick={() => navigate('/create-chama')}
                size="large"
              />
              <GridCard
                icon={UserCheck}
                title="JOIN CHAMA"
                onClick={() => navigate('/join-chama')}
                size="large"
              />
              <GridCard
                icon={Settings}
                title="ADVANCED FEATURES"
                onClick={() => navigate('/advanced-chama')}
                size="large"
              />
            </div>
          </div>
        );

      case 'ADVANCED_CHAMA':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Advanced Features</h2>
            <div className="grid grid-cols-3 gap-3">
              <GridCard
                icon={BarChart3}
                title="Dashboard"
                onClick={() => navigate('/chama/dashboard')}
                size="small"
              />
              <GridCard
                icon={DollarSign}
                title="Overview"
                onClick={() => navigate('/chama/overview')}
                size="small"
              />
              <GridCard
                icon={Users}
                title="Members"
                onClick={() => navigate('/member-management')}
                size="small"
              />
              <GridCard
                icon={Coins}
                title="Savings"
                onClick={() => navigate('/savings-contributions')}
                size="small"
              />
              <GridCard
                icon={TrendingUp}
                title="Loans"
                onClick={() => navigate('/loan-management')}
                size="small"
              />
              <GridCard
                icon={ArrowLeftRight}
                title="Invest"
                onClick={() => navigate('/investment-tracking')}
                size="small"
              />
              <GridCard
                icon={Calendar}
                title="Meetings"
                onClick={() => navigate('/meetings-voting')}
                size="small"
              />
              <GridCard
                icon={DollarSign}
                title="Expenses"
                onClick={() => navigate('/expense-management')}
                size="small"
              />
              <GridCard
                icon={ShieldCheck}
                title="Security"
                onClick={() => navigate('/security-permissions')}
                size="small"
              />
              <GridCard
                icon={MessageSquare}
                title="Community"
                onClick={() => navigate('/community-education')}
                size="small"
              />
              <GridCard
                icon={MessageCircle}
                title="Community"
                onClick={() => navigate('/community-hub')}
                size="small"
              />
              <GridCard
                icon={MessageSquare}
                title="Chat"
                onClick={() => navigate('/group-chat')}
                size="small"
              />
            </div>
          </div>
        );

      case 'WALLET':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Smart Wallet</h2>
            <div className="grid grid-cols-1 gap-4">
              <GridCard
                icon={Wallet}
                title="Smart Wallet"
                subtitle="Digital wallet management"
                onClick={() => navigate('/smart-wallet')}
                size="large"
              />
              <GridCard
                icon={Smartphone}
                title="Mobile Money"
                subtitle="M-Pesa integration"
                onClick={() => navigate('/mobile-money')}
                size="large"
              />
              <GridCard
                icon={Coins}
                title="Personal Savings"
                subtitle="Track your savings"
                onClick={() => navigate('/personal-savings')}
                size="large"
              />
            </div>
          </div>
        );

      case 'LOANS':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Loan Management</h2>
            <div className="grid grid-cols-2 gap-4">
              <GridCard
                icon={Plus}
                title="Apply for Loan"
                onClick={() => navigate('/apply-loan')}
                size="large"
              />
              <GridCard
                icon={CreditCard}
                title="My Loans"
                onClick={() => navigate('/loan-management')}
                size="large"
              />
              <GridCard
                icon={Brain}
                title="Adaptive Credit"
                onClick={() => navigate('/adaptive-credit')}
                size="large"
              />
              <GridCard
                icon={Shield}
                title="Blockchain Lending"
                onClick={() => navigate('/blockchain-lending')}
                size="large"
              />
            </div>
          </div>
        );

      case 'ANALYTICS':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 gap-4">
              <GridCard
                icon={BarChart3}
                title="Analytics Overview"
                subtitle="View all metrics"
                onClick={() => navigate('/analytics')}
                size="large"
              />
              <GridCard
                icon={PieChart}
                title="Financial Reports"
                subtitle="Detailed insights"
                onClick={() => navigate('/reports-statements')}
                size="large"
              />
              <GridCard
                icon={TrendingUp}
                title="Performance Metrics"
                subtitle="Track progress"
                onClick={() => navigate('/performance')}
                size="large"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Top Search Bar */}
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <SearchBar />
          </div>
        </div>

        {/* Secondary Header with Global Controls */}
        <div className="bg-muted/20 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-xs">🌐</span>
                </div>
                <LanguageSelector />
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-xs">🎨</span>
                </div>
                <ThemeToggle />
              </div>

              {user && (
                <>
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <Bell className="h-3 w-3 text-white" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationOpen(true)}
                      className="text-sm"
                    >
                      Notification
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-4 w-4 text-xs p-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-purple-500 text-white text-xs">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Profile</span>
                  </div>
                </>
              )}

              {!user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {user && (
          <div className="container mx-auto px-4 py-6 pb-24">
            {renderContent()}
          </div>
        )}

        {/* Guest Content */}
        {!user && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to ChamaVault</h1>
            <p className="text-muted-foreground mb-8">Your complete financial management platform</p>
            <Button onClick={() => setAuthModalOpen(true)} size="lg">
              Get Started
            </Button>
          </div>
        )}

        {/* Bottom Navigation */}
        {user && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 py-2">
                <Button
                  variant={activeTab === 'HOME' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab('HOME');
                    navigate('/');
                  }}
                  className="flex flex-col items-center px-4 h-12"
                >
                  <Home className="h-4 w-4" />
                  <span className="text-xs mt-1">HOME</span>
                </Button>

                <Button
                  variant={activeTab === 'CHAMA' || activeTab === 'ADVANCED_CHAMA' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab('CHAMA');
                    navigate('/chamas');
                  }}
                  className="flex flex-col items-center px-4 h-12"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs mt-1">CHAMA</span>
                </Button>

                <Button
                  variant={activeTab === 'WALLET' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab('WALLET');
                    navigate('/smart-wallet');
                  }}
                  className="flex flex-col items-center px-4 h-12"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs mt-1">WALLET</span>
                </Button>

                <Button
                  variant={activeTab === 'LOANS' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab('LOANS');
                    navigate('/apply-loan');
                  }}
                  className="flex flex-col items-center px-4 h-12"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs mt-1">LOANS</span>
                </Button>

                <Button
                  variant={activeTab === 'ANALYTICS' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab('ANALYTICS');
                    navigate('/analytics');
                  }}
                  className="flex flex-col items-center px-4 h-12"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs mt-1">ANALYTICS</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
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