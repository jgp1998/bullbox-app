import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import { useI18n } from '@/shared/context/i18n';
import FeedbackForm from '../components/FeedbackForm';
import Button from '@/shared/components/ui/Button';

const FeedbackPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-(--primary) to-(--primary-dark) rounded-3xl p-8 sm:p-12 shadow-2xl shadow-(--primary)/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest leading-none">
              <Sparkles className="w-3 h-3" />
              <span>{t('feedback.badge')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">
              {t('feedback.pageTitle')}
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-md leading-tight">
              {t('feedback.pageSubtitle')}
            </p>
          </div>
          
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center rotate-3 border border-white/20 shadow-2xl">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-(--card) p-6 rounded-3xl border border-(--border) shadow-xl shadow-black/5 hover:border-(--primary)/30 transition-all duration-300">
             <h3 className="text-sm font-black uppercase tracking-widest text-(--primary) mb-4">
               {t('feedback.sidebarTitle')}
             </h3>
             <ul className="space-y-4">
                {(['features', 'bugs', 'ux'] as const).map((key) => (
                  <li key={key} className="group">
                    <h4 className="text-sm font-bold text-(--text) group-hover:text-(--primary) transition-colors">
                      {t(`feedback.sidebarItems.${key}.title`)}
                    </h4>
                    <p className="text-xs text-(--muted-text)">
                      {t(`feedback.sidebarItems.${key}.desc`)}
                    </p>
                  </li>
                ))}
             </ul>
          </div>

          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center rounded-2xl py-4 border-(--border) text-(--muted-text) hover:border-(--primary)/50 hover:text-(--primary) transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2 bg-(--card) p-8 rounded-3xl border border-(--border) shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-(--primary)/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <FeedbackForm onSuccess={() => setTimeout(() => navigate('/'), 2500)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
