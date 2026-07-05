"use client";

import ScrollReveal from "./ScrollReveal";
import Title from "./Title";

/**
 * @param {{
 *   title: string;
 *   subtitle: string;
 *   width?: number;
 *   widthMobile?: number;
 *   subtitleWidth?: number;
 *   subtitleWidthMobile?: number;
 *   className?: string;
 *   sectionId?: string;
 *   marginTop?: number;
 *   align?: 'center' | 'left' | 'right';
 *   hasImage?: boolean;
 *   delay?: number;
 * }} props
 */
export default function MotionTitleBlock({
  title,
  subtitle,
  width,
  widthMobile,
  subtitleWidth,
  subtitleWidthMobile,
  className,
  sectionId,
  marginTop,
  align = "center",
  hasImage,
  delay = 0,
  as,
}) {
  return (
    <ScrollReveal
      id={sectionId}
      className={className}
      delay={delay}
      style={{ marginTop: marginTop ? `${marginTop}px` : undefined }}
    >
      <Title
        title={title}
        subtitle={subtitle}
        width={width}
        widthMobile={widthMobile}
        subtitleWidth={subtitleWidth}
        subtitleWidthMobile={subtitleWidthMobile}
        align={align}
        hasImage={hasImage}
        as={as}
      />
    </ScrollReveal>
  );
}
