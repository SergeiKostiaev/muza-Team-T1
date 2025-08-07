import React, { useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import parse, { Element, Text } from 'html-react-parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './QuestionPage.module.css';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';


function cleanHtml(html: string) {
    if (typeof window === 'undefined') return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgs = doc.querySelectorAll('img');
    imgs.forEach(img => img.remove());

    return doc.body.innerHTML;
}

const QuestionPage = () => {
    const { id } = useParams();
    const question = useSelector((state: RootState) =>
        state.questions.items.find((q) => q.id === id)
    );

    const [comments, setComments] = useState<string[]>([]);
    const [commentText, setCommentText] = useState('');

    if (!question) return <div className={styles.notFound}>Вопрос не найден</div>;

    const handleAddComment = () => {
        const trimmed = commentText.trim();
        if (trimmed === '') return;
        setComments([...comments, trimmed]);
        setCommentText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    const parsedContent = parse(cleanHtml(question.body), {
        replace: (domNode) => {
            if (
                domNode instanceof Element &&
                domNode.name === 'pre' &&
                domNode.children.length === 1 &&
                domNode.children[0] instanceof Element &&
                domNode.children[0].name === 'code'
            ) {
                const codeElement = domNode.children[0];
                const className = codeElement.attribs.class || '';
                const languageMatch = className.match(/language-(\w+)/);
                const language = languageMatch ? languageMatch[1] : '';

                const codeString = codeElement.children
                    .filter((child): child is Text => child.type === 'text')
                    .map((child) => child.data)
                    .join('');

                return (
                    <SyntaxHighlighter
                        style={prism}
                        language={language}
                        PreTag="div"
                        className={styles.codeBlock}
                    >
                        {codeString}
                    </SyntaxHighlighter>

                );
            }
        }
    });

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <nav>
                    <ul>
                        <Link to="/">Главная</Link>
                        <Link to="/questions">Все вопросы</Link>
                        <Link to="/tags">Все теги</Link>
                        <Link to="/ask">Задать вопрос</Link>
                    </ul>
                </nav>
            </aside>

            <main className={styles.main}>
                <h2 className={styles.title}>{question.title}</h2>
                <div className={styles.body}>{parsedContent}</div>

                <div className={styles.tags}>
                    {question.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>
                <div className={styles.votes}>👍 {question.votes}</div>

                <section className={styles.commentsSection}>
                    <h3>Комментарии</h3>

                    <ul className={styles.commentsList}>
                        {comments.length === 0 && <li>Пока нет комментариев</li>}
                        {comments.map((comment, i) => (
                            <li key={i} className={styles.comment}>
                                {comment}
                            </li>
                        ))}
                    </ul>

                    <textarea
                        className={styles.commentInput}
                        placeholder="Написать комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={3}
                    />

                    <button className={styles.addCommentBtn} onClick={handleAddComment}>
                        Добавить комментарий
                    </button>
                </section>
            </main>
        </div>
    );
};

export default QuestionPage;
