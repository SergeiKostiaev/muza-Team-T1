import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addQuestion } from '../features/questions/questionsSlice';
import styles from './CreateQuestionPage.module.css';

const CreateQuestionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = () => {
        dispatch(addQuestion({
            id: Date.now().toString(),
            title,
            body,
            tags: tags.split(',').map((t) => t.trim()),
            votes: 0,
        }));
        navigate('/');
    };

    return (
        <div className={styles.page}>
            <h2>Создание вопроса</h2>
            <input placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Вопрос" value={body} onChange={(e) => setBody(e.target.value)} />
            <input placeholder="Метки через запятую" value={tags} onChange={(e) => setTags(e.target.value)} />
            <button onClick={handleSubmit}>Сохранить</button>
        </div>
    );
};

export default CreateQuestionPage;
