/** Replace: define fields to match your plugin's domain data. */
export interface TreeCoverItem {
  id: string;
  label: string;
  position: [number, number];
  lastSeen: string;
}

/** Replace: extend if your layer metadata needs more fields. */
export interface TreeCoverLayerMetadata {
  title: string;
  group: string;
  color?: string;
  description?: string;
}
