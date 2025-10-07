import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, DollarSign, FileText, Megaphone } from 'lucide-react';
import { ContributionLeaderboard } from './ContributionLeaderboard';
import { AnnouncementComposer } from './AnnouncementComposer';
import { RealtimeContributionFeed } from './RealtimeContributionFeed';

interface RoleBasedDashboardProps {
  chamaId: string;
  userRole: string;
  isAdmin: boolean;
  isTreasurer: boolean;
  isSecretary: boolean;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  chamaId,
  userRole,
  isAdmin,
  isTreasurer,
  isSecretary
}) => {
  // Determine what features this role can access
  const canVerifyContributions = isAdmin || isTreasurer;
  const canSendAnnouncements = isAdmin || isSecretary;
  const canDownloadReports = isAdmin || isTreasurer;
  const canEditLoans = isAdmin || isTreasurer;

  return (
    <div className="space-y-6">
      {/* Role Badge */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Your Role</h3>
              <p className="text-2xl font-bold capitalize">{userRole}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isAdmin && 'Full access to all chama features'}
                {isTreasurer && 'Manage finances, verify contributions, generate reports'}
                {isSecretary && 'Send announcements, manage communications'}
                {!isAdmin && !isTreasurer && !isSecretary && 'View and contribute to chama'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Users className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          {canVerifyContributions && (
            <TabsTrigger value="verify">
              <DollarSign className="h-4 w-4 mr-2" />
              Verify
            </TabsTrigger>
          )}
          {canSendAnnouncements && (
            <TabsTrigger value="announce">
              <Megaphone className="h-4 w-4 mr-2" />
              Announce
            </TabsTrigger>
          )}
          {canDownloadReports && (
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RealtimeContributionFeed chamaId={chamaId} />
            <ContributionLeaderboard
              chamaId={chamaId}
              canDownload={canDownloadReports}
              canVerify={canVerifyContributions}
              userRole={userRole}
            />
          </div>
        </TabsContent>

        {canVerifyContributions && (
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Verify Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contribution verification interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canSendAnnouncements && (
          <TabsContent value="announce">
            <AnnouncementComposer chamaId={chamaId} userRole={userRole} />
          </TabsContent>
        )}

        {canDownloadReports && (
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Download Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Report generation interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
