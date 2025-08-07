import  { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useDispatch } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { addQuestion } from '../features/questions/questionsSlice';
import styles from './CreateQuestionPage.module.css';

const CreateQuestionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState<string | undefined>('');
    const [tags, setTags] = useState('');

    const handleSubmit = () => {
        if (!title || !body) return alert('Заполните заголовок и текст вопроса');
        dispatch(addQuestion({
            id: Date.now().toString(),
            title,
            body,
            tags: tags.split(',').map((t) => t.trim()),
            votes: 0,
            views: 0,
            answers: 0,
            author: 'Аноним',// из auth
            avatar: '',// из auth
            time: Date.now(),
        }));
        navigate('/');
    };

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
                <h2>Задать новый вопрос</h2>

                <input
                    type="text"
                    placeholder="Заголовок вопроса"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                />

                <div className={styles.editor}>
                    <MDEditor value={body} onChange={setBody} height={300} />
                </div>

                <input
                    type="text"
                    placeholder="Метки (через запятую)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={styles.input}
                />

                <button onClick={handleSubmit} className={styles.button}>
                    Сохранить
                </button>
            </main>
        </div>
    );
};

export default CreateQuestionPage;
