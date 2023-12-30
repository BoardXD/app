export function Table(props: {
  header: string[];
  values: string[];
}): React.ReactNode {
  const headers = props.header.map((title, index) => (
    <tr key={index}>
      <th>{title}</th>
    </tr>
  ));

  const data = props.values.map((value, index) => (
    <tr key={index}>
      <td>{value}</td>
    </tr>
  ));

  return (
    <table>
      <thead>{headers}</thead>
      <tbody>{!data.length ? "Nenhum dado encontrado" : data}</tbody>
    </table>
  );
}
