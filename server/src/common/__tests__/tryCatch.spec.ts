import {tryCatch} from '../tryCatch';

describe('tryCatch', () => {
    it('should return data and null error on successful promise resolution', async () => {
        const mockData = {id: 1, name: 'test'};
        const promise = Promise.resolve(mockData);

        const result = await tryCatch(promise);

        expect(result).toEqual({
            data: mockData,
            error: null
        });
    });

    it('should return null data and error on promise rejection', async () => {
        const error = new Error('Test error');
        const promise = Promise.reject(error);

        const result = await tryCatch(promise);

        expect(result).toEqual({
            data: null,
            error: error
        });
    });

    it('should handle async function that throws an error', async () => {
        const error = new Error('Async error');
        const asyncFn = async () => {
            throw error;
        };

        const result = await tryCatch(asyncFn());

        expect(result).toEqual({
            data: null,
            error: error
        });
    });

    it('should handle different data types successfully', async () => {
        // String
        expect(await tryCatch(Promise.resolve('test'))).toEqual({
            data: 'test',
            error: null
        });

        // Number
        expect(await tryCatch(Promise.resolve(123))).toEqual({
            data: 123,
            error: null
        });

        // Array
        const arr = [1, 2, 3];
        expect(await tryCatch(Promise.resolve(arr))).toEqual({
            data: arr,
            error: null
        });

        // Object
        const obj = {key: 'value'};
        expect(await tryCatch(Promise.resolve(obj))).toEqual({
            data: obj,
            error: null
        });
    });

    it('should handle custom error types', async () => {
        class CustomError extends Error {
            constructor(
                public code: string,
                message: string
            ) {
                super(message);
                this.name = 'CustomError';
            }
        }

        const customError = new CustomError('ERR_001', 'Custom error message');
        const promise = Promise.reject(customError);

        const result = await tryCatch<never, CustomError>(promise);

        expect(result).toEqual({
            data: null,
            error: customError
        });
        expect(result.error).toBeInstanceOf(CustomError);
        if (result.error) {
            expect(result.error.code).toBe('ERR_001');
            expect(result.error.message).toBe('Custom error message');
        }
    });

    it('should handle promises that resolve after some time', async () => {
        const mockData = {id: 1, name: 'delayed'};
        const delayedPromise = new Promise(resolve => {
            setTimeout(() => resolve(mockData), 100);
        });

        const result = await tryCatch(delayedPromise);

        expect(result).toEqual({
            data: mockData,
            error: null
        });
    });

    it('should handle promises that reject after some time', async () => {
        const error = new Error('Delayed error');
        const delayedPromise = new Promise((_, reject) => {
            setTimeout(() => reject(error), 100);
        });

        const result = await tryCatch(delayedPromise);

        expect(result).toEqual({
            data: null,
            error: error
        });
    });
});
