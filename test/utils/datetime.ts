export const getClockTimestamp = async (sequelize): Promise<Date> => {
  const { clock_timestamp } = await sequelize.query(
    'SELECT clock_timestamp();',
    {
      type: sequelize.QueryTypes.SELECT,
      plain: true,
    },
  );

  return new Date(clock_timestamp);
};

export const getEpochTime = async (
  tableName: string,
  fieldName: string,
  itemId: string,
  options,
): Promise<string | null> => {
  const { sequelize } = options;

  const result = await sequelize.query(`
    SELECT EXTRACT(EPOCH FROM ${fieldName})::varchar AS epoch_time
    FROM ${tableName}
    WHERE id = :id
  `, {
    plain: true,
    replacements: {
      id: itemId,
    },
  });

  return result?.epoch_time;
};
