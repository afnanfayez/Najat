import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import StepOne from '@/components/auth/Register/StepOne'
import { probeRegisterStepOne } from '@/lib/auth/probeRegisterStepOne'
import { useRegisterStore } from '@/store/useRegisterStore'

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

vi.mock('@/lib/auth/probeRegisterStepOne', () => ({
  probeRegisterStepOne: vi.fn(),
}))

const mockUpdateFormData = vi.fn()
const mockNextStep = vi.fn()

vi.mock('@/store/useRegisterStore', () => ({
  useRegisterStore: vi.fn(),
}))

describe('StepOne register', () => {
  beforeEach(() => {
    vi.mocked(useRegisterStore).mockReturnValue({
      formData: { name: '', email: '', phone: '' },
      updateFormData: mockUpdateFormData,
      nextStep: mockNextStep,
      fieldErrors: {},
    } as never)
    vi.mocked(probeRegisterStepOne).mockClear()
    vi.mocked(probeRegisterStepOne).mockResolvedValue({ ok: true })
    vi.mocked(toast.error).mockClear()
    mockUpdateFormData.mockClear()
    mockNextStep.mockClear()
  })

  it('on duplicate email: shows toast once, clears email, does not advance', async () => {
    const user = userEvent.setup()
    vi.mocked(probeRegisterStepOne).mockResolvedValue({
      ok: false,
      message: 'البريد الإلكتروني مستخدم بالفعل',
      clearEmail: true,
      clearPhone: false,
    })

    render(<StepOne />)

    await user.type(screen.getByLabelText(/الاسم كاملاً/i), 'أحمد')
    await user.type(screen.getByLabelText(/رقم الجوال/i), '0512345678')
    await user.type(screen.getByLabelText(/البريد الإلكتروني/i), 'dup@example.com')
    await user.click(screen.getByRole('button', { name: /التالي/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1)
    })
    expect(mockNextStep).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/البريد الإلكتروني/i)).toHaveValue('')
  })

  it('on success: updates form data and advances', async () => {
    const user = userEvent.setup()
    vi.mocked(probeRegisterStepOne).mockResolvedValue({ ok: true })

    render(<StepOne />)

    await user.type(screen.getByLabelText(/الاسم كاملاً/i), 'أحمد')
    await user.type(screen.getByLabelText(/رقم الجوال/i), '0512345678')
    await user.type(screen.getByLabelText(/البريد الإلكتروني/i), 'ok@example.com')
    await user.click(screen.getByRole('button', { name: /التالي/i }))

    await waitFor(() => {
      expect(mockNextStep).toHaveBeenCalledTimes(1)
    })
    expect(mockUpdateFormData).toHaveBeenCalledWith({
      name: 'أحمد',
      phone: '0512345678',
      email: 'ok@example.com',
    })
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('rapid double submit does not double-call probe after first resolution', async () => {
    const user = userEvent.setup()
    let resolveProbe!: (v: { ok: boolean }) => void
    const probePromise = new Promise<{ ok: boolean }>((r) => {
      resolveProbe = r
    })
    vi.mocked(probeRegisterStepOne).mockReturnValue(probePromise as never)

    render(<StepOne />)

    await user.type(screen.getByLabelText(/الاسم كاملاً/i), 'أحمد')
    await user.type(screen.getByLabelText(/رقم الجوال/i), '0512345678')
    await user.type(screen.getByLabelText(/البريد الإلكتروني/i), 'x@example.com')

    const btn = screen.getByRole('button', { name: /التالي/i })
    await user.click(btn)
    await user.click(btn)

    expect(probeRegisterStepOne).toHaveBeenCalledTimes(1)

    resolveProbe({ ok: true })
    await waitFor(() => {
      expect(mockNextStep).toHaveBeenCalledTimes(1)
    })
  })
})
