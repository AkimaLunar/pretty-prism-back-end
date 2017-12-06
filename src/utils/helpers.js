export const findOrCreate = (field, arg) => {
  const config = {
    query: {
      $where() {
        const match = [...arg];
        return (
          this.field.filter((el) => match.indexOf(el) != -1).length >= 2
        );
      }
    },
    update: {
      $setOnInsert: {
        users: [...arg]
      }
    },
    new: true,
    upsert: true
  };
  return config;
};
