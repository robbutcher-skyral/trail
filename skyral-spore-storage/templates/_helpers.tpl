{{- define "minio.protocol" }}
{{- if .Values.tenant.requestAutoCert }}https{{ else }}http{{ end -}}
{{- end }}
