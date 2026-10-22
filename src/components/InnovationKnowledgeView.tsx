import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, MessageSquare, Plus, CheckCircle2, Filter, Award, Send, X, BookOpen } from 'lucide-react';
import { InnovationIdea, Language } from '../types';
import { translations } from '../utils/translations';

interface InnovationKnowledgeViewProps {
  ideas: InnovationIdea[];
  lang: Language;
  onUpvoteIdea: (ideaId: string) => void;
  onAddComment: (ideaId: string, commentText: string, author: string) => void;
  onSubmitIdea: (newIdea: Omit<InnovationIdea, 'id' | 'upvotes' | 'comments' | 'submittedAt'>) => void;
}

export const InnovationKnowledgeView: React.FC<InnovationKnowledgeViewProps> = ({
  ideas,
  lang,
  onUpvoteIdea,
  onAddComment,
  onSubmitIdea
}) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isEthiopic = lang === 'am' || lang === 'ti';
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeCommentIdeaId, setActiveCommentIdeaId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [category, setCategory] = useState<InnovationIdea['category']>('conservation');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');

  const filteredIdeas = ideas.filter(idea => {
    if (selectedCategory === 'all') return true;
    return idea.category === selectedCategory;
  });

  const handleCommentSubmit = (ideaId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(
      ideaId,
      newCommentText,
      newCommentAuthor.trim() || (lang === 'am' ? 'ነዋሪ / አስተያየት ሰጪ' : 'Citizen Contributor')
    );
    setNewCommentText('');
  };

  const handleCreateIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !authorName.trim()) return;

    onSubmitIdea({
      titleAm: title,
      titleEn: title,
      authorName,
      authorRoleAm: authorRole || (lang === 'am' ? 'የውሃ ተጠቃሚ ነዋሪ' : 'Citizen'),
      authorRoleEn: authorRole || 'Citizen',
      category,
      summaryAm: summary,
      summaryEn: summary,
      detailsAm: details || summary,
      detailsEn: details || summary,
      status: 'community_proposal'
    });

    setIsSubmitModalOpen(false);
    setTitle('');
    setAuthorName('');
    setAuthorRole('');
    setSummary('');
    setDetails('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4 text-cyan-600" />
            <span>{lang === 'am' ? 'የማህበረሰብ የአሰራር እውቀትና ፈጠራ' : 'Citizen Knowledge & Innovation'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.ideasTitle}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.ideasSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-2.5 bg-cyan-700 text-white rounded-xl text-xs font-bold hover:bg-cyan-800 transition flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t.shareIdeaBtn}</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: t.catAllIdeas },
          { key: 'conservation', label: t.catConservation },
          { key: 'rainwater', label: t.catRainwater },
          { key: 'tech_efficiency', label: t.catTech },
          { key: 'leak_prevention', label: t.catLeakPrevention }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List of Innovation Proposals */}
      <div className="space-y-6">
        {filteredIdeas.map((idea) => {
          const isAdopted = idea.status === 'adopted_in_field';
          const isReviewed = idea.status === 'utility_reviewed';
          const isCommenting = activeCommentIdeaId === idea.id;

          return (
            <div
              key={idea.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 hover:border-slate-300 transition shadow-xs"
            >
              {/* Top metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-800">{idea.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{isEthiopic ? idea.authorRoleAm : idea.authorRoleEn}</span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(idea.submittedAt).toLocaleDateString()}</span>
                </div>

                <div>
                  {isAdopted && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      {t.adoptedBadge}
                    </span>
                  )}
                  {isReviewed && (
                    <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                      {t.reviewedBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEthiopic ? idea.titleAm : idea.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                  {isEthiopic ? idea.summaryAm : idea.summaryEn}
                </p>
                {(idea.detailsAm || idea.detailsEn) && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-3 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800 block mb-1">
                      {isEthiopic ? 'ዝርዝር ቴክኒካዊ አሰራር እና አተገባበር:' : 'Technical Methodology & Execution:'}
                    </span>
                    {isEthiopic ? idea.detailsAm : idea.detailsEn}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpvoteIdea(idea.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      idea.hasUpvoted
                        ? 'bg-cyan-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{idea.upvotes} {t.upvoteBtn}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentIdeaId(isCommenting ? null : idea.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{idea.comments.length} {lang === 'am' ? 'አስተያየቶች' : 'Comments'}</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 capitalize">
                  {idea.category.replace('_', ' ')}
                </span>
              </div>

              {/* Comments Section */}
              {isCommenting && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.discussionThread} ({idea.comments.length})
                  </h4>

                  <div className="space-y-2.5">
                    {idea.comments.map(c => (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          c.isStaff
                            ? 'bg-cyan-50/70 border border-cyan-200'
                            : 'bg-slate-50 border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            {c.author}
                            {c.isStaff && (
                              <span className="text-[10px] bg-cyan-700 text-white px-1.5 py-0.2 rounded font-semibold">
                                {lang === 'am' ? 'የውሃ ጽ/ቤት ምላሽ' : 'Official Utility Reply'}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.date}</span>
                        </div>
                        <p className="text-slate-700">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add comment input */}
                  <form onSubmit={(e) => handleCommentSubmit(idea.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder={t.addCommentPlaceholder}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3 h-3" />
                      <span>{lang === 'am' ? 'ላክ' : 'Post'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SUBMIT NEW INNOVATION PROPOSAL MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block mb-0.5">
                  {lang === 'am' ? 'የዜጎች እውቀትና ፈጠራ መጋሪያ' : 'Co-Creation & Knowledge Sharing'}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.submitIdeaModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIdeaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.ideaTitleLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === 'am' ? 'ምሳሌ፡ የዝናብ ውሃ ማቆር እና የከርሰ ምድር ውሃ ማበልጸጊያ ዘዴ...' : 'e.g., Rainwater recharge and decentralized filtration...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.reporterNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={lang === 'am' ? 'ስምዎ...' : 'Your name...'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.yourRoleLabel}
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder={lang === 'am' ? 'ምሳሌ፡ የውሃ መሃንዲስ፣ ነዋሪ...' : 'e.g. Water Engineer, Resident...'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.ideaCategoryLabel} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="conservation">{t.catConservation}</option>
                  <option value="rainwater">{t.catRainwater}</option>
                  <option value="tech_efficiency">{t.catTech}</option>
                  <option value="leak_prevention">{t.catLeakPrevention}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.ideaSummaryLabel} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={lang === 'am' ? 'የሃሳቡን ዋና ነጥብ እና የሚያስገኘውን ፋይዳ በአጭሩ ያስረዱ...' : 'Summarize the core premise and tangible benefit...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.ideaDetailsLabel}
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={lang === 'am' ? 'ዝርዝር የአሰራር ሂደት፣ የሚያስፈልጉ ግብዓቶች፣ ወይም በሙከራ የተረጋገጠ ውጤት...' : 'Detailed engineering steps, equipment, and feasibility notes...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-700 text-white text-xs font-bold rounded-lg hover:bg-cyan-800 transition shadow-sm flex items-center gap-1.5"
                >
                  <Lightbulb className="w-4 h-4" />
                  {t.submitIdeaBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
