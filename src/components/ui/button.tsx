import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border font-sans text-sm font-semibold tracking-[0.02em] whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-out outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg:not([class*='size-'])]:size-4 hover:[&_svg[data-arrow]]:translate-x-0.5",
  {
    variants: {
      variant: {
        default:
          "border-espresso bg-espresso text-cream hover:border-espresso-deep hover:bg-espresso-deep hover:shadow-[0_10px_30px_-12px_rgba(51,43,38,0.5)] active:translate-y-px",
        outline:
          "border-espresso/35 bg-transparent text-espresso hover:border-espresso hover:bg-espresso/[0.04] active:translate-y-px",
        rose: "border-rose-deep bg-rose-deep text-cream hover:border-espresso hover:bg-espresso active:translate-y-px",
        cream:
          "border-cream bg-cream/90 text-espresso hover:border-ivory hover:bg-ivory hover:shadow-[0_10px_30px_-12px_rgba(51,43,38,0.35)] active:translate-y-px",
        soft: "border-transparent bg-blush/70 text-espresso hover:bg-blush active:translate-y-px",
        ghost: "border-transparent text-espresso hover:bg-espresso/[0.05]",
        link: "h-auto rounded-none border-transparent px-0 text-espresso underline-offset-[6px] hover:underline",
        destructive: "border-destructive/30 bg-transparent text-destructive hover:bg-destructive/[0.06]",
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem]",
        default: "h-11 px-6",
        lg: "h-12 px-7 text-[0.95rem]",
        xl: "h-14 px-9 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      // When rendered as a <Link>, tell Base UI it is not a native <button>.
      nativeButton={nativeButton ?? !props.render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
