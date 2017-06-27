export function parseSelectionSetValues({ selections }) {
  return selections.map(selection => selection.name.value);
}

export function parseFieldNodes(fieldNodes) {
  if (!fieldNodes) {
    return [];
  }
  const response = {};
  for (const fieldNode of fieldNodes) {
    response[fieldNode.name.value] = parseSelectionSetValues(
      fieldNode.selectionSet,
    );
  }
  return response;
}
