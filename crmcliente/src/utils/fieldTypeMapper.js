// utils/fieldTypeMapper.js
export const mapMySQLTypeToHTMLInputType = (type) => {
  switch (type) {
    case 'varchar':
    case 'char':
    case 'text':
      return 'text';
    case 'int':
    case 'smallint':
    case 'mediumint':
    case 'bigint':
    case 'decimal':
    case 'float':
    case 'double':
      return 'number';
    case 'date':
      return 'date';
    case 'datetime':
    case 'timestamp':
      return 'datetime-local';
    case 'time':
      return 'time';
    case 'enum':
      return 'select';
    case 'tinyint':
      return 'checkbox';
    default:
      return 'text';
  }
};
