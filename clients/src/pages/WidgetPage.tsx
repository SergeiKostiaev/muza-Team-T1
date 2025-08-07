import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import styles from './WidgetPage.module.css';
import { type Question, setQuestions } from '../features/questions/questionsSlice.ts';

import defaultAvatar from '../assets/Avatar.png';

const filters = ['Интересные', 'Популярные', 'За месяц', 'За неделю'];

//для очистки от всех <img>
function cleanHtml(html: string) {
    if (typeof window === 'undefined') return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgs = doc.querySelectorAll('img');

    imgs.forEach(img => {
        img.remove();
    });

    return doc.body.innerHTML;
}

// Функция вывода аватара с fallback'ом
const getAvatarSrc = (avatar: string) => {
    if (!avatar || avatar.startsWith('https://i.sstatic.net')) {
        return defaultAvatar;
    }
    return avatar;
};

const QuestionItem = React.memo(({ q, onClick }: { q: Question; onClick: () => void }) => {
    return (
        <li className={styles.item} onClick={onClick}>
            <div className={styles.row}>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <strong>{q.votes}</strong>
                        <span>голосов</span>
                    </div>
                    <div className={styles.stat}>
                        <strong>{q.answers}</strong>
                        <span>ответов</span>
                    </div>
                    <div className={styles.stat}>
                        <strong>{q.views}</strong>
                        <span>показов</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.questionTitle}>{q.title}</h3>
                    <div
                        className={styles.body}
                        dangerouslySetInnerHTML={{ __html: cleanHtml(q.body) }}
                    />

                    <div className={styles.tags}>
                        {q.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className={styles.footer}>
                        <img
                            className={styles.avatar}
                            src={getAvatarSrc(q.avatar)}
                            alt={q.author}
                            onError={(e) => {
                                e.currentTarget.src = defaultAvatar;
                            }}
                        />
                        <span className={styles.author}>{q.author}</span>
                        <span className={styles.time}>• {new Date(q.time).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </li>
    );
});

const handleClick = () => {
    window.parent.postMessage({ type: 'openCreateQuestion' }, '*');
};

const WidgetPage = () => {
    const questions = useSelector((state: RootState) => state.questions.items);
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Интересные');
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('/stackoverflow-questions.json')
            .then((res) => res.json())
            .then((data) => {
                const questions: Question[] = data.map((q: any) => ({
                    id: q.question_id.toString(),
                    title: q.title,
                    body: q.body,
                    tags: q.tags,
                    votes: q.score,
                    author: q.owner?.display_name || 'anonymous',
                    avatar: '',
                    time: q.creation_date * 1000,
                    answers: q.answer_count || 0,
                    views: q.view_count || 0,
                }));
                dispatch(setQuestions(questions));
            })
            .catch(console.error);
    }, [dispatch]);

    const filteredQuestions = useMemo(() => {
        const now = Date.now();

        switch (activeFilter) {
            case 'Популярные':
                return [...questions].sort((a, b) => b.votes - a.votes);

            case 'За месяц':
                return questions
                    .filter((q) => {
                        const diffDays = (now - q.time) / (1000 * 60 * 60 * 24);
                        return diffDays <= 30;
                    })
                    .sort((a, b) => b.time - a.time);

            case 'За неделю':
                return questions
                    .filter((q) => {
                        const diffDays = (now - q.time) / (1000 * 60 * 60 * 24);
                        return diffDays <= 7;
                    })
                    .sort((a, b) => b.time - a.time);

            case 'Интересные':
            default:
                return [...questions].sort((a, b) => b.time - a.time);
        }
    }, [questions, activeFilter]);

    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="1" y="1" width="7" height="7" stroke="#8B8A8A" strokeWidth="2"/>
                        <rect x="12" y="12" width="7" height="7" stroke="#8B8A8A" strokeWidth="2"/>
                        <rect x="1" y="12" width="7" height="7" stroke="#8B8A8A" strokeWidth="2"/>
                        <rect x="12" y="1" width="7" height="7" stroke="#8B8A8A" strokeWidth="2"/>
                    </svg>
                    <h2>Вопросы</h2>
                </div>
                {/*<button onClick={() => navigate('/ask')} className={styles.askBtn}>*/}
                {/*    Задать вопрос*/}
                {/*</button>*/}
                <button onClick={handleClick}>Задать вопрос</button>

            </div>

            <div className={styles.line_active}>
            <h3>Активные</h3>
                <span></span>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.filtersRow}>
                    <input type="text" placeholder="Поиск..." className={styles.search} />
                    <div className={styles.filters}>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterBtn} ${
                                    activeFilter === filter ? styles.activeFilterBtn : ''
                                }`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <ul className={styles.list}>
                    {filteredQuestions.map((q) => (
                        <QuestionItem key={q.id} q={q} onClick={() => navigate(`/question/${q.id}`)} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WidgetPage;
