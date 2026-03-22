import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, X, Check } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { getTables, createTable, updateTable, deleteTable } from '../../lib/api';
import type { Table } from '../../lib/api';

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/20 dark:border-venetian-sandstone/20 dark:text-venetian-sandstone text-venetian-brown text-sm';

const LOCATION_COLORS: Record<string, string> = {
  indoor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  outdoor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  terrazza: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
  bar: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
};

const LOCATION_LABELS: Record<string, string> = {
  indoor: 'Interno',
  outdoor: 'Esterno',
  terrazza: 'Terrazza',
  bar: 'Bar',
};

type NewTableForm = {
  name: string;
  capacity: number;
  location: string;
  is_active: boolean;
};

const defaultForm: NewTableForm = { name: '', capacity: 4, location: 'indoor', is_active: true };

export function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewTableForm>(defaultForm);
  const [editForm, setEditForm] = useState<NewTableForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      setTables(data);
    } catch {
      toast.error('Errore nel caricare i tavoli');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error('Inserisci il nome del tavolo'); return; }
    setSaving(true);
    try {
      await createTable(form);
      toast.success('Tavolo creato');
      setForm(defaultForm);
      setShowAddForm(false);
      await loadTables();
    } catch (error) {
      console.error(error);
      toast.error('Errore nella creazione del tavolo');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    try {
      await updateTable(id, editForm);
      toast.success('Tavolo aggiornato');
      setEditingId(null);
      await loadTables();
    } catch (error) {
      console.error(error);
      toast.error('Errore nell\'aggiornamento del tavolo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo tavolo?')) return;
    setDeletingId(id);
    try {
      await deleteTable(id);
      toast.success('Tavolo eliminato');
      await loadTables();
    } catch (error) {
      console.error(error);
      toast.error('Errore nell\'eliminazione del tavolo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (table: Table) => {
    try {
      await updateTable(table.id, { is_active: !table.is_active });
      await loadTables();
    } catch (error) {
      console.error(error);
      toast.error('Errore nell\'aggiornamento');
    }
  };

  const startEdit = (table: Table) => {
    setEditingId(table.id);
    setEditForm({
      name: table.name,
      capacity: table.capacity,
      location: table.location,
      is_active: table.is_active,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 size={24} className="animate-spin text-venetian-brown/40" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone">
          Gestione Tavoli
        </h4>
        <Button
          size="sm"
          className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
          onClick={() => setShowAddForm(prev => !prev)}
        >
          <Plus size={16} className="mr-1" />
          Nuovo tavolo
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="p-4 bg-venetian-gold/10 dark:bg-venetian-gold/5 rounded-xl border border-venetian-gold/30 space-y-3"
        >
          <h5 className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">Nuovo tavolo</h5>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60 mb-1">Nome *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tavolo 1"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60 mb-1">Capacità</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.capacity}
                onChange={e => setForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60 mb-1">Zona</label>
              <select
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                className={inputClass}
              >
                <option value="indoor">Interno</option>
                <option value="outdoor">Esterno</option>
                <option value="terrazza">Terrazza</option>
                <option value="bar">Bar</option>
              </select>
            </div>
            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-venetian-brown dark:text-venetian-sandstone">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-venetian-gold"
                />
                Attivo
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => { setShowAddForm(false); setForm(defaultForm); }}
              className="text-venetian-brown dark:text-venetian-sandstone"
            >
              <X size={14} className="mr-1" /> Annulla
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} className="mr-1" /> Crea</>}
            </Button>
          </div>
        </motion.form>
      )}

      {/* Table list */}
      {tables.length === 0 ? (
        <p className="text-center text-venetian-brown/50 dark:text-venetian-sandstone/50 py-6 text-sm">
          Nessun tavolo configurato. Crea il primo!
        </p>
      ) : (
        <div className="space-y-2">
          {tables.map(table => (
            <motion.div
              key={table.id}
              layout
              className="flex items-center gap-3 p-3 bg-venetian-brown/5 dark:bg-white/5 rounded-lg"
            >
              {editingId === table.id ? (
                /* Edit mode */
                <div className="flex-1 grid sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={editForm.capacity}
                    onChange={e => setEditForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                    className={inputClass}
                  />
                  <select
                    value={editForm.location}
                    onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="indoor">Interno</option>
                    <option value="outdoor">Esterno</option>
                    <option value="terrazza">Terrazza</option>
                    <option value="bar">Bar</option>
                  </select>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white flex-1"
                      onClick={() => handleUpdate(table.id)}
                      disabled={saving}
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="text-venetian-brown dark:text-venetian-sandstone"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-venetian-brown dark:text-venetian-sandstone text-sm">{table.name}</span>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', LOCATION_COLORS[table.location] ?? 'bg-gray-100 text-gray-800')}>
                        {LOCATION_LABELS[table.location] ?? table.location}
                      </span>
                      <span className="text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60">
                        {table.capacity} posti
                      </span>
                      {!table.is_active && (
                        <span className="text-xs text-venetian-brown/40 dark:text-venetian-sandstone/40 italic">inattivo</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleActive(table)}
                      className={cn(
                        'w-9 h-5 rounded-full transition-colors relative',
                        table.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      )}
                      title={table.is_active ? 'Disattiva' : 'Attiva'}
                    >
                      <span className={cn(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        table.is_active ? 'translate-x-4' : 'translate-x-0.5'
                      )} />
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(table)}
                      className="text-venetian-brown dark:text-venetian-sandstone"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(table.id)}
                      disabled={deletingId === table.id}
                      className="border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {deletingId === table.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
