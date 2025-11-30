export const handleChange = (e, setState) => {
    setState((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
    });
};