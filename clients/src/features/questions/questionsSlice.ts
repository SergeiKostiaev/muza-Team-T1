import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Question {
    id: string;
    title: string;
    body: string;
    answers: number;
    views: number;
    author: string;
    avatar: string;
    tags: string[];
    votes: number;
    time: number;
}

interface QuestionsState {
    items: Question[];
}

const initialState: QuestionsState = {
    items: [
        // {
        //     id: '1',
        //     title: 'Как реализовать авторизацию через Google в React?',
        //     body: 'Пытаюсь реализовать авторизацию через Google, но получаю ошибку 400. В чём может быть проблема?',
        //     votes: 12,
        //     answers: 3,
        //     views: 123,
        //     tags: ['react', 'oauth', 'google-auth'],
        //     author: 'Иван Петров',
        //     avatar: 'https://i.pravatar.cc/24?img=1',
        //     time: '2 часа назад'
        // },
        // {
        //     id: '2',
        //     title: 'Как работает useEffect в React?',
        //     body: 'Не могу понять, когда именно вызывается useEffect и как правильно указывать зависимости.',
        //     votes: 8,
        //     answers: 5,
        //     views: 230,
        //     tags: ['react', 'hooks', 'useEffect'],
        //     author: 'Алена Смирнова',
        //     avatar: 'https://i.pravatar.cc/24?img=2',
        //     time: '5 часов назад'
        // },
        // {
        //     id: '3',
        //     title: 'Хуки в React?',
        //     body: 'это функции, с помощью которых вы можете «подцепиться» к состоянию и методам жизненного цикла React из функциональных компонентов.',
        //     votes: 8,
        //     answers: 5,
        //     views: 230,
        //     tags: ['react', 'hooks', 'useEffect'],
        //     author: 'Алена Смирнова',
        //     avatar: 'https://i.pravatar.cc/24?img=2',
        //     time: '5 часов назад'
        // },
    ],
};

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setQuestions(state, action: PayloadAction<Question[]>) {
            state.items = action.payload;
        },
        addQuestion(state, action: PayloadAction<Question>) {
            state.items.unshift(action.payload);
        },
    },
});



export const { setQuestions, addQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;