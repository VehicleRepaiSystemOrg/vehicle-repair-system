import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-message-mechanic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-mechanic.page.html',
  styleUrl: './message-mechanic.page.scss'
})
export class MessageMechanicPageComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  activeContactId = '1';
  newMessage = '';

  contacts: Contact[] = [
    {
      id: '1',
      name: 'Mike R.',
      role: 'Lead Technician',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop',
      lastMessage: 'I sent you a photo of the brake caliper.',
      lastMessageTime: '10:35 AM',
      unreadCount: 0,
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah J.',
      role: 'Service Advisor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
      lastMessage: 'Your invoice is ready for review.',
      lastMessageTime: 'Yesterday',
      unreadCount: 2,
      isOnline: false
    }
  ];

  activeMessages: Message[] = [
    { id: 1, sender: 'them', text: 'Hi! Just wanted to update you on the Roadster.', time: '10:30 AM' },
    { id: 2, sender: 'them', text: 'We found the issue with the left caliper.', time: '10:31 AM' },
    { id: 3, sender: 'me', text: 'Thanks Mike! Is it going to delay the repair?', time: '10:32 AM' },
    { id: 4, sender: 'them', text: 'Not at all. We have the part in stock.', time: '10:34 AM' },
    { 
      id: 5, 
      sender: 'them', 
      text: 'Here is what it looks like before we clean it up.', 
      time: '10:35 AM',
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&auto=format&fit=crop'
    }
  ];

  get activeContact() {
    return this.contacts.find(c => c.id === this.activeContactId);
  }

  selectContact(id: string) {
    this.activeContactId = id;
    // In a real app, fetch messages for this contact here
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Add user message
    this.activeMessages.push({
      id: Date.now(),
      sender: 'me',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.newMessage = '';
    
    // Simulate auto-scroll
    this.scrollToBottom();
  }

  // Auto-scroll to bottom of chat
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {
      // Ignore errors if element is not available
    }
  }
}