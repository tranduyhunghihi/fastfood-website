import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Support.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faHeadset, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { io } from 'socket.io-client';

const cx = classNames.bind(styles);

const SOCKET_URL = 'http://localhost:5000';

// Tạo sessionId duy nhất cho mỗi khách
const getSessionId = () => {
    let sid = localStorage.getItem('chat_session');
    if (!sid) {
        sid = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        localStorage.setItem('chat_session', sid);
    }
    return sid;
};

function Message({ msg }) {
    const isAdmin = msg.sender === 'admin';
    return (
        <div className={cx('msg-wrap', { 'msg-admin': isAdmin, 'msg-user': !isAdmin })}>
            <div className={cx('msg-avatar')}>
                <FontAwesomeIcon icon={isAdmin ? faHeadset : faUser} />
            </div>
            <div className={cx('msg-content')}>
                <p className={cx('msg-name')}>{msg.senderName}</p>
                <div className={cx('msg-bubble')}>{msg.content}</div>
                <p className={cx('msg-time')}>
                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}

export default function Support() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const sessionId = getSessionId();

    useEffect(() => {
        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('user:join', {
                sessionId,
                customerName: user?.name || 'Khách',
                customerEmail: user?.email || '',
            });
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('chat:history', (history) => setMessages(history));

        socket.on('chat:message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const sendMessage = () => {
        const content = input.trim();
        if (!content || !connected) return;
        setInput('');
        socketRef.current.emit('user:message', {
            sessionId,
            content,
            senderName: user?.name || 'Khách',
        });
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Link to="/" className={cx('back-btn')}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Trở lại
                </Link>
                <div className={cx('header-center')}>
                    <div className={cx('bot-avatar')}>
                        <FontAwesomeIcon icon={faHeadset} />
                    </div>
                    <div>
                        <p className={cx('bot-name')}>FastFoot Support</p>
                        <p className={cx('bot-status', { online: connected, offline: !connected })}>
                            {connected ? '🟢 Đang kết nối' : '🔴 Mất kết nối'}
                        </p>
                    </div>
                </div>
                <div style={{ width: 80 }} />
            </div>

            <div className={cx('chat-area')}>
                {messages.length === 0 && (
                    <div className={cx('welcome')}>
                        <FontAwesomeIcon icon={faHeadset} className={cx('welcome-icon')} />
                        <p className={cx('welcome-title')}>Xin chào! 👋</p>
                        <p className={cx('welcome-desc')}>
                            Hãy gửi tin nhắn để được hỗ trợ. Đội ngũ FastFoot sẽ phản hồi sớm nhất có thể.
                        </p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <Message key={i} msg={msg} />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className={cx('input-area')}>
                <textarea
                    ref={inputRef}
                    className={cx('input-box')}
                    placeholder="Nhập tin nhắn... (Enter để gửi)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={!connected}
                />
                <button
                    className={cx('send-btn', { 'send-active': input.trim() && connected })}
                    onClick={sendMessage}
                    disabled={!input.trim() || !connected}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}
