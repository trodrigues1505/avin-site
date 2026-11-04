import sharp from 'sharp';
// Imagem padrão de compartilhamento (1200x630) a partir da capa.
await sharp('src/assets/capa.png').resize(1200, 630, { fit: 'cover', position: 'left' }).png().toFile('public/og-default.png');
