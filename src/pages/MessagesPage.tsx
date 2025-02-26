import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Mail, Clock, User, MessageSquare, Loader2, Search, Filter } from 'lucide-react';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

type Message = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
};

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Message['status'] | 'all'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: Message['status']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));

      toast.success('Message status updated');
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-venetian-sandstone/20 pt-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-serif text-venetian-brown mb-2">Contact Messages</h1>
              <p className="text-venetian-brown/70">
                View and manage messages from the contact form
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-venetian-brown/40" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 w-full"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-venetian-brown/40" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Message['status'] | 'all')}
                  className="pl-10 pr-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-venetian-brown animate-spin" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-venetian-brown/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-venetian-brown mb-1">No messages found</h3>
              <p className="text-venetian-brown/70">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No messages have been received yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/95 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
                    message.status === 'unread' ? 'border-l-4 border-venetian-gold' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-serif text-venetian-brown mb-2">
                          {message.subject}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-venetian-brown/70">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {message.first_name} {message.last_name}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {message.email}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {format(new Date(message.created_at), 'PPp')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={message.status}
                          onChange={(e) => updateMessageStatus(message.id, e.target.value as Message['status'])}
                          className="px-3 py-1.5 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-sm"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-venetian-brown/5 rounded-lg p-4">
                      <p className="text-venetian-brown/80 whitespace-pre-line">
                        {message.message}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                        onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
                      >
                        Reply via Email
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}