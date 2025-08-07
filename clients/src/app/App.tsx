import { Routes, Route } from 'react-router-dom';
import WidgetPage from '../pages/WidgetPage';
import QuestionPage from '../pages/QuestionPage';
import CreateQuestionPage from '../pages/CreateQuestionPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<WidgetPage />} />
            <Route path="/question/:id" element={<QuestionPage />} />
            <Route path="/ask" element={<CreateQuestionPage />} />
        </Routes>
    );
};

export default App;