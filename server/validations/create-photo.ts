
export  = {
    title: {
        in: ["body"],
        isString: {
            errorMessage: 'Title must be provided and has to be a string.',
            bail: true
        },
        isLength: {
            options: { min: 5},
            errorMessage: 'Title must be at least 5 characters long.',
        },
        
        
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: 'Description must be provided and has to be a string.',
            bail: true
        },
        isLength: {
            options: { min: 10 },
            errorMessage: 'Description must be at least 10 characters long.'
        }
    },
    visible: {
        in: ["body"],
        isBoolean: {
            errorMessage: 'You must provide if this photo will be visible or not. Possibile values: true or false.',
            bail: true
        },
        toBoolean: true,
        errorMessage: 'You can specifiy 0 or false for hidden or visible photos.'
    },
    categories: {
        in: ["body"],
    }
}

