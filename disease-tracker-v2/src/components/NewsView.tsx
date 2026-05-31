import { Newspaper, ExternalLink, ShieldCheck } from "lucide-react";
import { NewsArticle } from "../types";

interface NewsViewProps {
  news: NewsArticle[];
}

export default function NewsView({ news }: NewsViewProps) {
  return (
    <div className="space-y-6" id="news-container">
      <div className="bg-white dark:bg-slate-900 border-4 border-[#1A1A1A] dark:border-slate-600 rounded-3xl p-6 shadow-[6px_6px_0px_#1A1A1A] dark:shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 bg-[#FF5F1F] text-white rounded-xl border-2 border-[#1A1A1A]">
            <Newspaper className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A] dark:text-white">
              Health News Feed
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              WHO, CDC, and verified outbreak reports — explained simply
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {news.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              No news articles yet. Run the ETL pipeline to fetch WHO Disease Outbreak News.
            </p>
          )}
          {news.map((article) => (
            <article
              key={article.id}
              className="p-4 bg-[#FAF4EE] dark:bg-slate-800 border-2 border-[#1A1A1A] dark:border-slate-600 rounded-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-[#1A1A1A] dark:text-white text-sm md:text-base flex-1">
                  {article.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded border border-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  Trust {article.trustScore}%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                {article.summary}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span>{article.source} · {new Date(article.date).toLocaleDateString()}</span>
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#FF5F1F] font-bold hover:underline"
                  >
                    Read source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
