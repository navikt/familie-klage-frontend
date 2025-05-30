import { Control, FieldValues, useFormState } from 'react-hook-form';
import { useEffect, useRef } from 'react';

export function useOnFormSubmitSuccessful<T extends FieldValues>(
    control: Control<T>,
    callback: () => void
) {
    const { isSubmitSuccessful } = useFormState<T>({ control });

    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        // It's recommended to reset inside useEffect after submission,
        // see https://react-hook-form.com/docs/useform/reset.
        if (isSubmitSuccessful) {
            callbackRef.current();
        }
    }, [isSubmitSuccessful]);
}
