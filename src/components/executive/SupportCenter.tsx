import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export const SupportCenter = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('support-center')}</h1>
          <p className="text-gray-600">{t('support-center-desc')}</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('refresh-tickets')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('open-tickets')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('in-progress')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">{t('being-handled')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('resolved-today')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">{t('completed')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avg-response')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">{t('response-time')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('support-center')}</h3>
          <p className="text-gray-600 mb-4">
            {t('support-center-coming-soon')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">{t('ticket-management')}</Badge>
            <Badge variant="outline">{t('live-chat')}</Badge>
            <Badge variant="outline">{t('knowledge-base')}</Badge>
            <Badge variant="outline">{t('automated-responses')}</Badge>
            <Badge variant="outline">{t('performance-metrics')}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
