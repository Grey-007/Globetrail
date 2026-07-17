import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Edit3, Check, X } from 'lucide-react';
import { Place } from '@/features/home/domain/entities/Place';
import { locationRepository } from '@/core/di/injection';

interface TravelJournalEditorProps {
  place: Place;
}

export const TravelJournalEditor: React.FC<TravelJournalEditorProps> = ({ place }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(place.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(place.notes || '');
  }, [place.notes]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await locationRepository.updatePlace({
        ...place,
        notes: content,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save journal', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(place.notes || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
        <div className="bg-canvas border-b border-border px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Markdown Editor</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCancel}
              className="p-1.5 text-text-muted hover:text-text-main rounded-md transition-colors"
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1.5 deboss bg-canvas text-success rounded-md text-xs font-bold tracking-wide flex items-center gap-1.5 transition-colors hover:text-accent"
              disabled={isSaving}
            >
              <Check className="w-4 h-4" />
              {isSaving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 bg-transparent text-text-main p-4 focus:outline-none resize-y font-mono text-sm leading-relaxed"
          placeholder="# Travel Journal\n\n## Things to do\n- [ ] Visit museum\n\n## Local food\n- Try the street food"
        />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 group relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 p-2 rounded-full deboss text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-main hover:text-accent"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      
      {content ? (
        <div className="prose prose-invert prose-sm max-w-none text-text-muted prose-headings:text-text-main prose-a:text-accent-blue prose-strong:text-text-main">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-text-muted text-sm mb-2">No journal entries yet.</p>
          <p className="text-border text-xs mb-4">Jot down memories, itineraries, or things to do.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs px-4 py-2 rounded-full border border-border text-text-main hover:text-accent transition-colors"
          >
            Start Writing
          </button>
        </div>
      )}
    </div>
  );
};
