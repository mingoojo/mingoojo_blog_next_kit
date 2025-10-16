// components/ImageWithCaption.tsx
import React from 'react'

type Props = {
  src: string
  alt?: string
  caption?: string
  width?: string | number
  height?: string | number
}

export default function ImageWithCaption({
  src,
  alt = '',
  caption = '',
  width = 'auto',
  height = 'auto',
}: Props) {
  return (
    <figure
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '2em 0',
      }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          borderRadius: '8px',
          maxWidth: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      />
      {caption && (
        <figcaption
          style={{
            fontSize: '0.9rem',
            color: '#666',
            marginTop: '8px',
            textAlign: 'center',
          }}>
          {`[ ${caption} ]`}
        </figcaption>
      )}
    </figure>
  )
}
