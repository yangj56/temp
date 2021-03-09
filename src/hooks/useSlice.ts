import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { AppDispatch } from '../store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
