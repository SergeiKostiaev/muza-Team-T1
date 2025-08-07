import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type {RootState} from '../app/store';
import styles from './QuestionPage.module.css';

const QuestionPage = () => {
    const { id } = useParams();
    const question = useSelector((state: RootState) =>
        state.questions.items.find((q) => q.id === id)
    );

    if (!question) return <div>Вопрос не найден</div>;

    return (
        <div className={styles.page}>
            <h2>{question.title}</h2>
            <p>{question.body}</p>
            <div className={styles.tags}>{question.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <div>👍 {question.votes}</div>
        </div>
    );
};

export default QuestionPage;