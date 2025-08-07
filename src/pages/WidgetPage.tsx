import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import styles from './WidgetPage.module.css';
import {useState} from "react";

const filters = ['Интересные', 'Популярные', 'За месяц', 'За неделю'];

const WidgetPage = () => {
    const questions = useSelector((state: RootState) => state.questions.items);
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Интересные');

    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="7" height="7" stroke="#8B8A8A" strokeWidth="2" />
                        <rect x="12" y="12" width="7" height="7" stroke="#8B8A8A" strokeWidth="2" />
                        <rect x="1" y="12" width="7" height="7" stroke="#8B8A8A" strokeWidth="2" />
                        <rect x="12" y="1" width="7" height="7" stroke="#8B8A8A" strokeWidth="2" />
                    </svg>
                    <h2>Вопросы</h2>
                </div>
                <button onClick={() => navigate('/ask')} className={styles.askBtn}>
                    Задать вопрос
                </button>
            </div>

            <div className={styles.line_active}>
                <h3>Активные</h3>
                <span></span>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.filtersRow}>
                    <input type="text" placeholder="Поиск..." className={styles.search}/>
                    <div className={styles.filters}>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilterBtn : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>


                <ul className={styles.list}>
                    {questions.map((q) => (
                        <li key={q.id} className={styles.item}>
                            <div className={styles.row} onClick={() => navigate(`/question/${q.id}`)}>
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
                                    <p className={styles.body}>{q.body}</p>

                                    <div className={styles.tags}>
                                        {q.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className={styles.footer}>
                                        <img className={styles.avatar} src={q.avatar} alt={q.author}/>
                                        <span className={styles.author}>{q.author}</span>
                                        <span className={styles.time}>• {q.time}</span>
                                    </div>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WidgetPage;
